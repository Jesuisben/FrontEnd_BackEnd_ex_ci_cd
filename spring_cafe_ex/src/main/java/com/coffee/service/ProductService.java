package com.coffee.service;

import com.coffee.entity.Product;
import com.coffee.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    // S3 업로드/삭제를 담당하는 서비스 주입
    @Autowired
    private S3Service s3Service;

    public List<Product> getProductList() {
        return this.productRepository.findProductByOrderByIdDesc();
    }

    // base64 이미지를 S3에 업로드하고, 접근 가능한 전체 URL을 리턴
    private String saveProductImage(String base64Image) {
        // 파일명 생성 (기존과 동일: product_년월일시분.jpg)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        String formattedNow = LocalDateTime.now().format(formatter);
        String imageFileName = "product_" + formattedNow + ".jpg";

        // base64 문자열 → 이미지 바이트 데이터로 디코딩
        // ex) data:image/png;base64,iVBORw0... 에서 , 뒤만 사용
        byte[] decodedImage = Base64.getDecoder().decode(base64Image.split(",")[1]);

        // S3에 업로드하고, 리턴받은 전체 URL을 그대로 DB에 저장할 값으로 반환
        // 예: https://coffee-shop-images-hyeonmin.s3.ap-northeast-2.amazonaws.com/product_xxx.jpg
        return s3Service.upload(decodedImage, imageFileName);
    }

    // 상품 id를 이용한 삭제
    public boolean deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return false;
        }

        // S3에서 이미지 삭제 (DB에 저장된 값이 전체 URL이어도 S3Service가 파일명만 뽑아냄)
        String imageUrl = product.getImage();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                s3Service.delete(imageUrl);
            } catch (Exception e) {
                System.out.println("S3 이미지 삭제 실패: " + e.getMessage());
                // 이미지 삭제 실패해도 DB 상품은 지움 (정책에 따라 조정 가능)
            }
        }

        productRepository.deleteById(id);
        return true;
    }

    /* 상품 등록 */
    public Product insertProduct(Product product) {
        if (product.getImage() != null && product.getImage().startsWith("data:image")) {
            // S3에 업로드하고 전체 URL을 image 컬럼에 저장
            String imageUrl = saveProductImage(product.getImage());
            product.setImage(imageUrl);
        }

        product.setInputdate(LocalDate.now());
        System.out.println("서비스)상품 등록 정보");
        System.out.println(product);

        return productRepository.save(product);
    }

    /* 상품 수정 - 단건 조회 (get) */
    public Product getProductById(Long id) {
        Optional<Product> product = this.productRepository.findById(id);
        return product.orElse(null);
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    // 이전 이미지를 S3에서 삭제하는 메소드
    private void deleteOldImage(String oldImageUrl) {
        if (oldImageUrl == null || oldImageUrl.isBlank()) {
            return;
        }
        try {
            s3Service.delete(oldImageUrl);
        } catch (Exception e) {
            System.err.println("기존 S3 이미지 삭제 실패: " + oldImageUrl);
        }
    }

    /* 상품 수정 (put) */
    public Product updateProduct(Product savedProduct, Product updatedProduct) {
        savedProduct.setName(updatedProduct.getName());
        savedProduct.setPrice(updatedProduct.getPrice());
        savedProduct.setCategory(updatedProduct.getCategory());
        savedProduct.setStock(updatedProduct.getStock());
        savedProduct.setDescription(updatedProduct.getDescription());

        if (updatedProduct.getImage() != null && updatedProduct.getImage().startsWith("data:image")) {
            // 기존 S3 이미지 삭제 후 새 이미지 업로드
            deleteOldImage(savedProduct.getImage());
            String imageUrl = saveProductImage(updatedProduct.getImage());
            savedProduct.setImage(imageUrl);
        }

        return productRepository.save(savedProduct);
    }
}
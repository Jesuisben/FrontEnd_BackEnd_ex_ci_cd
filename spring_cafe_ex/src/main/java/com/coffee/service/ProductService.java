package com.coffee.service;

import com.coffee.entity.Product;
import com.coffee.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository ;

    // ProductRepository에서 만든 쿼리 메소드를 이용해서 메소드만들어서 Controller에 이용할 예정
    public List<Product> getProductList(){
        return this.productRepository.findProductByOrderByIdDesc();
    }

    // application.properties에서 이미지가 있는 실제 위치 가져오기
    @Value("${productImageLocation}")
    private String productImageLocation ;

    // 상품 id를 이용한 삭제
    // 1) 삭제할 상품이 데이터 베이스에 실제로 존재하는지 id를 통해 확인
    // 2) 운영체제에서 상품 삭제
    // 3) 상품 자체를 삭제

    // 1) 상품이 존재 하는지 확인
    public boolean deleteProduct(Long id){
        // 상품 가져오기 / 상품 id에 맞는 상품이 없으면 오류가 나니까
        // orElse()을 넣어서 ()안에 있는 내용을 가져오기 (null)을 가져옴
        Product product = productRepository.findById(id).orElse(null) ;

        // 상품id에 맞는 상품이 없으면
        if(product == null){
            return false ; // 없는 상품을 삭제할 수 없으니 상품 삭제 메소드는 실패해서 (false)를 반환함
        }

        // 상품id에 맞는 상품이 있으면
        // 2) 이미지가 있는 c드라이브 폴더(운영체제 내)에 가서 이미지 지우기
        String fileName = product.getImage() ;
        if(fileName != null && !fileName.isEmpty()){ // 다시 한 번 정상적인 파일이름인지 확인하기
            // application.properties에서 가져온 이미지 위치 연결하기
            File file = new File(productImageLocation + fileName) ;

            System.out.println("삭제될 파일 이름");
            // ex) C:\\upload\images\americano.jpg
            System.out.println(file.getAbsolutePath()); // 절대 경로 보여주기

            if(file.exists()){ // 해당 경로에! 삭제를 원하는 그 파일이 존재하는지 확인
                // 실제로 해당 경로의 파일을 삭제하고
                // 성공하면 true / 실패하면 false 반환함
                boolean deleted = file.delete() ;

                if(!deleted){ // 조건이 성립되려면 deleted가 false여야 !deleted가 true여서 메소드가 시작됨
                    System.out.println("이미지 삭제 실패");
                }
            }
        }
        // 3) 데이터 베이스에서 상품 삭제하기
        // 운영체제에서 이미지 파일을 삭제했으니 데이터 베이스에서도 삭제하기
        productRepository.deleteById(id);
        return true; // deleteProduct() 메소드 반환
    }
}
package com.swisui.yard.service;

import com.swisui.yard.domain.Loading;
import com.swisui.yard.domain.LoadingProduct;
import com.swisui.yard.domain.Product;
import com.swisui.yard.repository.LoadingRepository;
import com.swisui.yard.repository.ProductRepository;
import com.swisui.yard.service.dto.LoadingDTO;
import com.swisui.yard.service.mapper.LoadingMapper;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoadingService {

    private final LoadingRepository loadingRepository;
    private final ProductRepository productRepository;
    private final LoadingMapper loadingMapper;

    public LoadingService(LoadingRepository loadingRepository, ProductRepository productRepository) {
        this.loadingRepository = loadingRepository;
        this.productRepository = productRepository;
        this.loadingMapper = new LoadingMapper();
    }

    @Transactional
    public Loading save(Loading loading) {
        Map<Long, Product> productsMap = productRepository
            .findAll()
            .stream()
            .collect(Collectors.toMap(Product::getId, Function.identity()));

        loading
            .getLoadingProducts()
            .stream()
            .forEach(loadingProduct -> {
                Product product = productsMap.get(loadingProduct.getProduct().getId());
                if (loadingProduct.getUnits() == null) {
                    loadingProduct.setUnits(0d);
                }
                if (loadingProduct.getUnitPrice() == null) {
                    loadingProduct.setUnitPrice(product.getDefaultPrice());
                }
                if (loadingProduct.getGst() == null) {
                    loadingProduct.setGst(product.getDefaultGST());
                }
                loadingProduct.setTotal(loadingProduct.getUnits() * loadingProduct.getUnitPrice() * (1.0 + loadingProduct.getGst()));
            });
        return loadingRepository.save(loading);
    }

    @Transactional(readOnly = true)
    public Set<LoadingProduct> getLoadingProducts(Long loadingId) {
        Loading loading = loadingRepository.findOneByIdWithLoadingProducts(loadingId);
        return loading.getLoadingProducts();
    }

    @Transactional
    public Loading save(Long loadingId, List<LoadingProduct> products) {
        Loading loading = loadingRepository.findOneByIdWithLoadingProducts(loadingId);
        Map<Long, Product> productsMap = productRepository
            .findAll()
            .stream()
            .collect(Collectors.toMap(Product::getId, Function.identity()));
        products
            .stream()
            .forEach(loadingProduct -> {
                Product product = productsMap.get(loadingProduct.getProduct().getId());
                if (loadingProduct.getUnitPrice() == null) {
                    loadingProduct.setUnitPrice(product.getDefaultPrice());
                }
                if (loadingProduct.getGst() == null) {
                    loadingProduct.setGst(product.getDefaultGST());
                }
                loadingProduct.setTotal(loadingProduct.getUnits() * loadingProduct.getUnitPrice() * (1.0 + loadingProduct.getGst()));
            });
        loading.setLoadingProducts(products);
        return loadingRepository.save(loading);
    }

    @Transactional(readOnly = true)
    public List<Loading> getAllLoadings() {
        return loadingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Loading> getLoading(Long id) {
        return Optional.ofNullable(loadingRepository.findOneByIdWithLoadingProducts(id));
    }

    @Transactional
    public void deleteLoading(Long id) {
        loadingRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return loadingRepository.existsById(id);
    }
}

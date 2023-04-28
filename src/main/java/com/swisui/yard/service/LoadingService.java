package com.swisui.yard.service;

import com.swisui.yard.domain.Loading;
import com.swisui.yard.repository.LoadingRepository;
import com.swisui.yard.service.dto.LoadingDTO;
import com.swisui.yard.service.mapper.LoadingMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoadingService {

    private final LoadingRepository loadingRepository;
    private final LoadingMapper loadingMapper;

    public LoadingService(LoadingRepository loadingRepository) {
        this.loadingRepository = loadingRepository;
        this.loadingMapper = new LoadingMapper();
    }

    @Transactional
    public Loading save(LoadingDTO loadingDTO) {
        return loadingRepository.save(loadingMapper.loadingDTOToLoading(loadingDTO));
    }

    @Transactional(readOnly = true)
    public List<Loading> getAllLoadings() {
        return loadingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Loading> getLoading(Long id) {
        return loadingRepository.findById(id);
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

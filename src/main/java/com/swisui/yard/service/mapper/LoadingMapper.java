package com.swisui.yard.service.mapper;

import com.swisui.yard.domain.Loading;
import com.swisui.yard.domain.User;
import com.swisui.yard.service.dto.LoadingDTO;
import com.swisui.yard.service.dto.UserDTO;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class LoadingMapper {

    public List<LoadingDTO> loadingsToLoadingDTOs(List<Loading> loadings) {
        return loadings.stream().filter(Objects::nonNull).map(this::loadingToLoadingDTO).collect(Collectors.toList());
    }

    public LoadingDTO loadingToLoadingDTO(Loading loading) {
        return new LoadingDTO(loading);
    }

    public List<Loading> loadingDTOssToLoadings(List<LoadingDTO> loadingDTOs) {
        return loadingDTOs.stream().filter(Objects::nonNull).map(this::loadingDTOToLoading).collect(Collectors.toList());
    }

    public Loading loadingDTOToLoading(LoadingDTO loadingDTO) {
        if (loadingDTO == null) return null;

        Loading loading = new Loading();
        loading.setId(loading.getId());
        loading.setYard(loadingDTO.getYard());
        loading.setVehicleNumber(loadingDTO.getVehicleNumber());
        loading.setLoadingTime(loadingDTO.getLoadingTime());
        return loading;
    }
}

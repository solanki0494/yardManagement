package com.swisui.yard.service.dto;

import com.swisui.yard.domain.Loading;
import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.NotNull;

public class LoadingDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long id;

    @NotNull
    private String yard;

    @NotNull
    private String vehicleNumber;

    private Instant loadingTime;

    public LoadingDTO(Loading loading) {
        this(loading.getId(), loading.getYard(), loading.getVehicleNumber(), loading.getLoadingTime());
    }

    public LoadingDTO(Long id, String yard, String vehicleNumber, Instant loadingTime) {
        this.id = id;
        this.yard = yard;
        this.vehicleNumber = vehicleNumber;
        this.loadingTime = loadingTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getYard() {
        return yard;
    }

    public void setYard(String yard) {
        this.yard = yard;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public Instant getLoadingTime() {
        return loadingTime;
    }

    public void setLoadingTime(Instant loadingTime) {
        this.loadingTime = loadingTime;
    }
}

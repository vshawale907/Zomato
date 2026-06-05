package com.zomato.clone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceOrderRequest {
    
    @NotNull(message = "Delivery address is required")
    private Long addressId;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // UPI, CREDIT_CARD, DEBIT_CARD, CASH_ON_DELIVERY
}

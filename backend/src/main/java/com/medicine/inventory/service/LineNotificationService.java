package com.medicine.inventory.service;

import com.medicine.inventory.entity.Medicine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class LineNotificationService {

    private static final Logger log = LoggerFactory.getLogger(LineNotificationService.class);
    private static final String LINE_API_URL = "https://api.line.me/v2/bot/message/push";

    private final WebClient webClient;
    private final String channelToken;
    private final String userId;

    public LineNotificationService(
            @Value("${line.channel-token:}") String channelToken,
            @Value("${line.user-id:}") String userId) {
        this.channelToken = channelToken;
        this.userId = userId;
        this.webClient = WebClient.builder()
                .baseUrl(LINE_API_URL)
                .build();
    }

    public void notifyLowStock(Medicine medicine) {
        if (channelToken.isBlank() || userId.isBlank()) {
            log.warn("LINE設定が未構成のため通知をスキップします（薬: {}, 残数: {}）",
                    medicine.getName(), medicine.getQuantity());
            return;
        }

        String message = String.format(
                "⚠️ 薬在庫アラート\n\n以下の薬の在庫が少なくなっています：\n\n💊 %s\n　残数: %d個（閾値: %d個）\n\n早めの補充をお勧めします。",
                medicine.getName(), medicine.getQuantity(), medicine.getAlertThreshold()
        );

        Map<String, Object> body = Map.of(
                "to", userId,
                "messages", List.of(Map.of("type", "text", "text", message))
        );

        webClient.post()
                .header("Authorization", "Bearer " + channelToken)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(res -> log.info("LINE通知送信成功（薬: {}）", medicine.getName()))
                .doOnError(err -> log.error("LINE通知送信失敗（薬: {}）: {}", medicine.getName(), err.getMessage()))
                .subscribe();
    }
}

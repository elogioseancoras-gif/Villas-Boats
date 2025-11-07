package com.villasboats.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Service for emitting webhook events to n8n workflows for booking automation.
 * Handles inquiry notifications, follow-ups, and status updates.
 */
@Service
@Slf4j
public class WebhookService {

    private final RestTemplate restTemplate;
    private final String n8nBaseUrl;

    public WebhookService(
            RestTemplate restTemplate,
            @Value("${n8n.webhook.base-url}") String n8nBaseUrl) {
        this.restTemplate = restTemplate;
        this.n8nBaseUrl = n8nBaseUrl;
    }

    /**
     * Emit booking inquiry created event to n8n.
     * Triggers email notification and WhatsApp message generation.
     *
     * @param inquiryData Map containing inquiry details
     */
    public void emitInquiryCreated(Map<String, Object> inquiryData) {
        String webhookUrl = n8nBaseUrl + "/booking-inquiry-new";
        emitWebhook(webhookUrl, inquiryData, "inquiry-created");
    }

    /**
     * Emit booking inquiry follow-up event to n8n.
     * Triggers follow-up email if customer hasn't responded.
     *
     * @param inquiryData Map containing inquiry details
     */
    public void emitInquiryFollowUp(Map<String, Object> inquiryData) {
        String webhookUrl = n8nBaseUrl + "/booking-inquiry-followup";
        emitWebhook(webhookUrl, inquiryData, "inquiry-followup");
    }

    /**
     * Emit booking status update event to n8n.
     * Triggers status change notification to customer.
     *
     * @param bookingData Map containing booking details including new status
     */
    public void emitBookingStatusUpdate(Map<String, Object> bookingData) {
        String webhookUrl = n8nBaseUrl + "/booking-status-update";
        emitWebhook(webhookUrl, bookingData, "booking-status-update");
    }

    /**
     * Generic webhook emission method with error handling.
     *
     * @param webhookUrl Full URL of the n8n webhook endpoint
     * @param payload Data to send to webhook
     * @param eventType Type of event for logging purposes
     */
    private void emitWebhook(String webhookUrl, Map<String, Object> payload, String eventType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> enrichedPayload = new HashMap<>(payload);
            enrichedPayload.put("event_type", eventType);
            enrichedPayload.put("timestamp", System.currentTimeMillis());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(enrichedPayload, headers);

            log.info("Emitting {} webhook to: {}", eventType, webhookUrl);
            restTemplate.postForEntity(webhookUrl, request, String.class);
            log.info("Successfully emitted {} webhook", eventType);

        } catch (Exception e) {
            log.error("Failed to emit {} webhook to {}: {}", eventType, webhookUrl, e.getMessage());
            // Don't throw exception - webhook failures shouldn't break main flow
        }
    }

    /**
     * Build inquiry data payload for webhooks.
     *
     * @param bookingReference Unique booking reference
     * @param customerName Customer's full name
     * @param customerEmail Customer's email address
     * @param customerPhone Customer's phone number
     * @param boatName Name of the boat
     * @param startDatetime Start date and time as string
     * @param endDatetime End date and time as string
     * @param guestCount Number of guests
     * @param needsCaptain Whether captain service is needed
     * @param totalPrice Total price as string
     * @param currency Currency code
     * @param customerNotes Optional customer notes
     * @return Map ready for webhook emission
     */
    public Map<String, Object> buildInquiryPayload(
            String bookingReference,
            String customerName,
            String customerEmail,
            String customerPhone,
            String boatName,
            String startDatetime,
            String endDatetime,
            Integer guestCount,
            Boolean needsCaptain,
            String totalPrice,
            String currency,
            String customerNotes) {

        Map<String, Object> payload = new HashMap<>();
        payload.put("booking_reference", bookingReference);
        payload.put("customer_name", customerName);
        payload.put("customer_email", customerEmail);
        payload.put("customer_phone", customerPhone);
        payload.put("boat_name", boatName);
        payload.put("start_datetime", startDatetime);
        payload.put("end_datetime", endDatetime);
        payload.put("guest_count", guestCount);
        payload.put("needs_captain", needsCaptain);
        payload.put("total_price", totalPrice);
        payload.put("currency", currency);
        payload.put("customer_notes", customerNotes != null ? customerNotes : "");
        payload.put("whatsapp_number", "+351915500020");

        return payload;
    }

    /**
     * Build booking status update payload for webhooks.
     *
     * @param bookingReference Unique booking reference
     * @param customerName Customer's full name
     * @param customerEmail Customer's email address
     * @param oldStatus Previous booking status
     * @param newStatus New booking status
     * @param boatName Name of the boat
     * @param startDatetime Start date and time as string
     * @return Map ready for webhook emission
     */
    public Map<String, Object> buildStatusUpdatePayload(
            String bookingReference,
            String customerName,
            String customerEmail,
            String oldStatus,
            String newStatus,
            String boatName,
            String startDatetime) {

        Map<String, Object> payload = new HashMap<>();
        payload.put("booking_reference", bookingReference);
        payload.put("customer_name", customerName);
        payload.put("customer_email", customerEmail);
        payload.put("old_status", oldStatus);
        payload.put("new_status", newStatus);
        payload.put("boat_name", boatName);
        payload.put("start_datetime", startDatetime);

        return payload;
    }
}

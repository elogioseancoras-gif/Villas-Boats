package com.villasboats.domain.entity;

import com.villasboats.domain.valueobject.Language;
import com.villasboats.domain.valueobject.UserRole;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_role", columnList = "role")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "phone", length = 50)
    private String phone;

    @Builder.Default
    @Convert(converter = com.villasboats.infrastructure.converter.UserRoleConverter.class)
    @Column(name = "role", nullable = false)
    private UserRole role = UserRole.CUSTOMER;

    @Builder.Default
    @Convert(converter = com.villasboats.infrastructure.converter.LanguageConverter.class)
    @Column(name = "preferred_language")
    private Language preferredLanguage = Language.EN;

    @Column(name = "country", length = 100)
    private String country;

    @Builder.Default
    @Column(name = "is_email_verified", nullable = false)
    private Boolean isEmailVerified = false;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "email_verification_token", length = 100)
    private String emailVerificationToken;

    @Column(name = "password_reset_token", length = 100)
    private String passwordResetToken;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;
}

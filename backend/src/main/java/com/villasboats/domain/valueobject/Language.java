package com.villasboats.domain.valueobject;

public enum Language {
    EN("en"),
    PT_BR("pt-BR"),
    PT_PT("pt-PT"),
    ES("es");

    private final String code;

    Language(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static Language fromCode(String code) {
        for (Language lang : values()) {
            if (lang.code.equalsIgnoreCase(code)) {
                return lang;
            }
        }
        throw new IllegalArgumentException("Unknown language code: " + code);
    }
}

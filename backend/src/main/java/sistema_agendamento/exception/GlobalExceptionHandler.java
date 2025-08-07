package sistema_agendamento.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        log.error("Erro de runtime: {}", ex.getMessage(), ex);
        
        String mensagem = ex.getMessage();
        if (mensagem == null || mensagem.isEmpty()) {
            mensagem = "Ocorreu um erro inesperado";
        }
        
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Erro de validação",
                mensagem
        );
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        log.error("Erro de validação: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        StringBuilder mensagemGeral = new StringBuilder();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
            
            // Construir mensagem geral
            if (mensagemGeral.length() > 0) {
                mensagemGeral.append("; ");
            }
            
            String campoTraduzido = traduzirCampo(fieldName);
            mensagemGeral.append(campoTraduzido).append(": ").append(traduzirMensagem(errorMessage));
        });

        ValidationErrorResponse error = new ValidationErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Erro de validação",
                mensagemGeral.toString(),
                errors
        );
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Erro genérico: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno do servidor",
                "Ocorreu um erro inesperado. Tente novamente mais tarde."
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    private String traduzirCampo(String fieldName) {
        switch (fieldName) {
            case "nome": return "Nome";
            case "email": return "Email";
            case "celular": return "Celular";
            case "telefone": return "Telefone";
            case "favorito": return "Favorito";
            case "ativo": return "Ativo";
            default: return fieldName;
        }
    }

    private String traduzirMensagem(String message) {
        if (message == null) return "Campo inválido";
        
        switch (message) {
            case "must not be null":
            case "must not be empty":
                return "Campo obrigatório";
            case "must be a well-formed email address":
                return "Email inválido";
            case "size must be between 0 and 100":
                return "Máximo de 100 caracteres";
            case "size must be between 0 and 255":
                return "Máximo de 255 caracteres";
            case "must match \"^[0-9]{11}$\"":
                return "Deve ter exatamente 11 dígitos";
            case "must match \"^[0-9]{10}$\"":
                return "Deve ter exatamente 10 dígitos";
            default:
                return message;
        }
    }

    public static class ErrorResponse {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;

        public ErrorResponse(LocalDateTime timestamp, int status, String error, String message) {
            this.timestamp = timestamp;
            this.status = status;
            this.error = error;
            this.message = message;
        }

        // Getters e Setters
        public LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
        public int getStatus() { return status; }
        public void setStatus(int status) { this.status = status; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ValidationErrorResponse extends ErrorResponse {
        private Map<String, String> errors;

        public ValidationErrorResponse(LocalDateTime timestamp, int status, String error, String message, Map<String, String> errors) {
            super(timestamp, status, error, message);
            this.errors = errors;
        }

        public Map<String, String> getErrors() { return errors; }
        public void setErrors(Map<String, String> errors) { this.errors = errors; }
    }
} 
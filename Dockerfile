# Use an official PHP runtime as the base image
FROM php:8.3-alpine

# Install system dependencies and PHP extensions needed for Laravel
RUN apk update && \
    apk add --no-cache \
        curl \
        git \
        zip \
        unzip \
        libpng-dev \
        libzip-dev \
        oniguruma-dev \
        # MySQL dependencies:
        mariadb-client \
        mariadb-connector-c-dev

# Install and enable PHP extensions
RUN docker-php-ext-install \
        pdo_mysql \
        mbstring \
        tokenizer \
        xml \
        gd \
        zip

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory in the container
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Set file permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose the port the app runs on
EXPOSE 10000

# Define the command to run the application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
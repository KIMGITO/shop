# Use an official PHP runtime as the base image
FROM php:8.3-alpine

# Install system dependencies and PHP extensions needed for Laravel
RUN apk update && \
    apk add --no-cache \
        curl \
        git \
        zip \
        unzip \
        # MySQL dependencies:
        mariadb-client \
        mariadb-connector-c-dev \
        # Build dependencies (will be removed later):
        build-base \
        # GD extension dependencies:
        freetype-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        # ZIP extension dependencies:
        libzip-dev \
        # Other extension dependencies:
        oniguruma-dev

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install \
        pdo \
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

# Clean up build dependencies to keep image small
RUN apk del build-base

# Set file permissions for Laravel
RUN chmod -R 775 storage bootstrap/cache && \
    chown -R www-data:www-data storage bootstrap/cache

# Expose the port the app runs on
EXPOSE 10000

# Define the command to run the application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
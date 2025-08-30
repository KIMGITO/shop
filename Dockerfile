# Use an official PHP runtime as the base image
FROM php:8.3-alpine

# Install system dependencies and PHP extensions needed for Laravel
RUN apk add --no-cache \
    curl \
    git \
    zip \
    unzip \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    postgresql-dev \
    && docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql \
    bcmath \
    ctype \
    curl \
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
RUN composer install --no-dev --optimize-autoloader

# Optimize the application
RUN php artisan optimize:clear && php artisan optimize

# Expose the port the app runs on
EXPOSE 10000

# Define the command to run the application
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
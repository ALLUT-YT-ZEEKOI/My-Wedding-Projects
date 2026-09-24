# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: PHP Apache Web Server
FROM php:8.2-apache
WORKDIR /var/www/html

# Install required PHP extensions & utilities
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql pdo_sqlite gd zip

# Enable Apache mod_rewrite for Laravel routing
RUN a2enmod rewrite

# Update Apache Document Root to /var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application source code
COPY . /var/www/html
COPY --from=frontend /app/public/build /var/www/html/public/build

# Copy .env.example to .env if .env does not exist
RUN cp -n .env.example .env

# Install PHP dependencies for production
RUN composer install --no-dev --optimize-autoloader

# Create SQLite DB file and run key generation & storage link
RUN touch /var/www/html/database/database.sqlite \
    && php artisan key:generate --force \
    && php artisan storage:link --force

# Set full read/write permissions for storage, cache, and database
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/.env \
    && chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/.env

# Startup command: Bind port, run migrations & seeders, then start Apache
CMD PORT="${PORT:-80}" && sed -i "s/80/$PORT/g" /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf \
    && php artisan migrate --force \
    && php artisan db:seed --force \
    && apache2-foreground

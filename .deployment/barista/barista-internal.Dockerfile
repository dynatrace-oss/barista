
FROM nginx:alpine

COPY .deployment/barista/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .deployment/barista/nginx/sites-available /etc/nginx/sites-available

RUN ln -s /etc/nginx/sites-available /etc/nginx/sites-enabled

COPY dist/apps/barista-design-system/browser /var/www/barista

EXPOSE 80


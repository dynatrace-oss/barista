FROM nginx:alpine

COPY .deployment/barista/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .deployment/barista/nginx/sites-available /etc/nginx/sites-available

RUN ln -s /etc/nginx/sites-available /etc/nginx/sites-enabled && \
    # remove the default nginx config (hello I'm nginx) because it is
    # running on localhost:80 as well and it would conflict with barista
    rm -rf /etc/nginx/conf.d/default.conf

COPY dist/apps/barista-design-system/browser /var/www/barista
COPY dist/apps/next /var/www/next

EXPOSE 80


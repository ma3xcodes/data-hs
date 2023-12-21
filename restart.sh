npm run build
pm2 stop all
pm2 delete all
pm2 restart ecosystem.config.js --update-env
pm2 save
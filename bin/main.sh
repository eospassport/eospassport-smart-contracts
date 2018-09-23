echo 'cleos' $@
docker-compose exec keosd /opt/eosio/bin/cleos -u https://nodes.get-scatter.com:443/ --wallet-url http://localhost:8900 $@

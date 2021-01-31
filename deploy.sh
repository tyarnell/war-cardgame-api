echo "Destroying old environment..." && cd ./terraform && terraform destroy --auto-approve
echo "Building app..." && cd ../app && zip -r ../terraform/latest.zip * -x "*node_modules*"
echo "Building new enivornment" && cd ../terraform && terraform apply --auto-approve

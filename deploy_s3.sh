function log {
  echo -e "$(date +%T):  $@"
}

log "Checking current IAM user"
current_user=$(aws sts get-caller-identity |jq -r .Arn)

if [ "$current_user" == "arn:aws:iam::${AWS_ACCOUNT_ID}:user/${AWS_USER}" ];

then
  log "$current_user is allowed to assume the ${AWS_ROLE}"
  aws sts assume-role --role-arn arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_ROLE} --role-session-name ${AWS_ROLE}-session > /tmp/assumed_role
  export AWS_ACCESS_KEY_ID=`cat /tmp/assumed_role |jq -r .Credentials.AccessKeyId`
  export AWS_SECRET_ACCESS_KEY=`cat /tmp/assumed_role |jq -r .Credentials.SecretAccessKey`
  export AWS_SESSION_TOKEN=`cat /tmp/assumed_role |jq -r .Credentials.SessionToken`
  rm -rf /tmp/assumed_role
  aws s3 sync --acl public-read public/ s3://www.tech-notes.net/ --delete
else
  echo "Current user can't assume role"
fi

if [ "$current_user" == "arn:aws:iam::${AWS_ACCOUNT_ID}:role/${AWS_ROLE}" ]; then
  log "Can deploy files without assuming"
  aws s3 sync --acl public-read public/ s3://www.tech-notes.net/ --delete
fi
log "Done"

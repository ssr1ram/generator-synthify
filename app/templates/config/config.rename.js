
module.exports = {
    project_name: "synthify",
    hosturl: "http://your.domain.com",
    port: process.env.PORT || 3000,
    secret: "changeme",

    // parse
    parse_app: "fill-in",
    parse_appid: "fill-in",
    parse_restkey: "fill-in",
    parse_jskey: "fill-in",

    // iocache
    iocache_hosts: "cache-aws-us-east-1.iron.io:11211",
    iocache_token: "fill-in",
    iocache_project_id: "fill-in",
    iocache_cache_name: "fill-in",

    // email
    email_service: false, // false, smtp or mailgun
    email_from: "foo <foo@mydomain.com>",
    mailgun_api_key: "fill-in",

    // social
    google_oauth: false,
    google_client_id: "fill-in",
    google_client_secret: "fill-in",
    facebook_oauth: false,
    facebook_app_id: "fill-in",
    facebook_app_secret: "fill-in",
    twitter_oauth: false,
    twitter_api_key: "fill-in",
    twitter_api_secret: "fill-in",
    linkedin_oauth: false,
    linkedin_api_key: "fill-in",
    linkedin_api_secret: "fill-in"
}

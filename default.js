module.exports = {
    offline: false,
    sync: true,
    bucket: 'bucket_name',
    access_key: 'AccessKey',
    secret_key: 'SecretKey',
    dirPrefix: 'static',
    urlPrefix: 'http://bucket_name.qiniudn.com/static',
    local_dir: 'static',
    update_exist: true,
    image: {
        folder: 'images',
        extend: ''
    },
    js: {
        folder: 'js'
    },
    css: {
        folder: 'css'
    }
};
from storages.backends.s3 import S3Storage


class StaticS3Storage(S3Storage):
    location = "static"


class MediaS3Storage(S3Storage):
    location = "media"

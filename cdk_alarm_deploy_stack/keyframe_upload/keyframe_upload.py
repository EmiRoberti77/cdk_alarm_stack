import boto3


def upload_image_to_s3(file_path, bucket_name, s3_key):

    a = ''
    b = ''

    s3 = boto3.client('s3', aws_access_key_id=a,
                      aws_secret_access_key=b)

    try:
        with open(file_path, 'rb') as file:
            s3.upload_fileobj(file, bucket_name, s3_key)

        s3.put_object_acl(Bucket=bucket_name, Key=s3_key, ACL='public-read')

        object_url = "https://"+bucket_name+".s3.amazonaws.com/"+s3_key

        print("Image uploaded successfully to S3!")
        return object_url
    except Exception as e:
        print("Error uploading image to S3:", str(e))


# call code from here
file_path = 'parked_train.jpeg'
bucket_name = 'thumbnailalarmbucket'
s3_key = 'camera1.jpg'
obj_url = upload_image_to_s3(file_path, bucket_name, s3_key)
# make call to post end point and pass obj_url
print(obj_url)

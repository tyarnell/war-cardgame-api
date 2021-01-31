
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "dist_bucket" {
  bucket = "war-api-deployment"
}

resource "aws_s3_bucket_object" "default" {
  bucket = aws_s3_bucket.dist_bucket.id
  key    = "beanstalk/app.zip"
  source = "latest.zip"
}


resource "aws_elastic_beanstalk_application" "default" {
  name        = var.service_name
  description = var.service_description
}

resource "aws_elastic_beanstalk_environment" "default" {
  name                = var.service_name
  application         = aws_elastic_beanstalk_application.default.name
  version_label       = aws_elastic_beanstalk_application_version.default.name
  solution_stack_name = var.eb_env_solution_stack

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

}

resource "aws_elastic_beanstalk_application_version" "default" {
  application = var.service_name
  name        = "${var.service_name}-${uuid()}"
  bucket      = aws_s3_bucket.dist_bucket.id
  key         = aws_s3_bucket_object.default.id
}

module "dynamodb_table" {
  source         = "terraform-aws-modules/dynamodb-table/aws"
  read_capacity  = 10
  write_capacity = 10

  name     = "games-table"
  hash_key = "id"

  attributes = [
    {
      name = "id"
      type = "S"
    }
  ]

  tags = {
    Terraform   = "true"
    Environment = "staging"
  }
}

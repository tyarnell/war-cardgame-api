variable "region" {
  default = "us-west-2"
}

variable "service_name" {
  default = "tf-war-api"
}

variable "service_description" {
  default = "elastic beanstalk sercive for a simple game of war."
}

variable "eb_env_solution_stack" {
  default = "64bit Amazon Linux 2018.03 v4.17.2 running Node.js"
}

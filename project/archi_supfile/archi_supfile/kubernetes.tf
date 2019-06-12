output "bastion_security_group_ids" {
  value = ["${aws_security_group.bastion-lmaj-tk.id}"]
}

output "bastions_role_arn" {
  value = "${aws_iam_role.bastions-lmaj-tk.arn}"
}

output "bastions_role_name" {
  value = "${aws_iam_role.bastions-lmaj-tk.name}"
}

output "cluster_name" {
  value = "lmaj.tk"
}

output "master_security_group_ids" {
  value = ["${aws_security_group.masters-lmaj-tk.id}"]
}

output "masters_role_arn" {
  value = "${aws_iam_role.masters-lmaj-tk.arn}"
}

output "masters_role_name" {
  value = "${aws_iam_role.masters-lmaj-tk.name}"
}

output "node_security_group_ids" {
  value = ["${aws_security_group.nodes-lmaj-tk.id}"]
}

output "node_subnet_ids" {
  value = ["${aws_subnet.us-east-1a-lmaj-tk.id}", "${aws_subnet.us-east-1b-lmaj-tk.id}", "${aws_subnet.us-east-1c-lmaj-tk.id}"]
}

output "nodes_role_arn" {
  value = "${aws_iam_role.nodes-lmaj-tk.arn}"
}

output "nodes_role_name" {
  value = "${aws_iam_role.nodes-lmaj-tk.name}"
}

output "region" {
  value = "us-east-1"
}

output "vpc_id" {
  value = "${aws_vpc.lmaj-tk.id}"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_autoscaling_attachment" "bastions-lmaj-tk" {
  elb                    = "${aws_elb.bastion-lmaj-tk.id}"
  autoscaling_group_name = "${aws_autoscaling_group.bastions-lmaj-tk.id}"
}

resource "aws_autoscaling_attachment" "master-us-east-1a-masters-lmaj-tk" {
  elb                    = "${aws_elb.api-lmaj-tk.id}"
  autoscaling_group_name = "${aws_autoscaling_group.master-us-east-1a-masters-lmaj-tk.id}"
}

resource "aws_autoscaling_attachment" "master-us-east-1b-masters-lmaj-tk" {
  elb                    = "${aws_elb.api-lmaj-tk.id}"
  autoscaling_group_name = "${aws_autoscaling_group.master-us-east-1b-masters-lmaj-tk.id}"
}

resource "aws_autoscaling_attachment" "master-us-east-1c-masters-lmaj-tk" {
  elb                    = "${aws_elb.api-lmaj-tk.id}"
  autoscaling_group_name = "${aws_autoscaling_group.master-us-east-1c-masters-lmaj-tk.id}"
}

resource "aws_autoscaling_group" "bastions-lmaj-tk" {
  name                 = "bastions.lmaj.tk"
  launch_configuration = "${aws_launch_configuration.bastions-lmaj-tk.id}"
  max_size             = 1
  min_size             = 1
  vpc_zone_identifier  = ["${aws_subnet.utility-us-east-1a-lmaj-tk.id}", "${aws_subnet.utility-us-east-1b-lmaj-tk.id}", "${aws_subnet.utility-us-east-1c-lmaj-tk.id}"]

  tag = {
    key                 = "KubernetesCluster"
    value               = "lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "Name"
    value               = "bastions.lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    value               = "bastions"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/role/bastion"
    value               = "1"
    propagate_at_launch = true
  }

  metrics_granularity = "1Minute"
  enabled_metrics     = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
}

resource "aws_autoscaling_group" "master-us-east-1a-masters-lmaj-tk" {
  name                 = "master-us-east-1a.masters.lmaj.tk"
  launch_configuration = "${aws_launch_configuration.master-us-east-1a-masters-lmaj-tk.id}"
  max_size             = 1
  min_size             = 1
  vpc_zone_identifier  = ["${aws_subnet.us-east-1a-lmaj-tk.id}"]

  tag = {
    key                 = "KubernetesCluster"
    value               = "lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "Name"
    value               = "master-us-east-1a.masters.lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    value               = "master-us-east-1a"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/role/master"
    value               = "1"
    propagate_at_launch = true
  }

  metrics_granularity = "1Minute"
  enabled_metrics     = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
}

resource "aws_autoscaling_group" "master-us-east-1b-masters-lmaj-tk" {
  name                 = "master-us-east-1b.masters.lmaj.tk"
  launch_configuration = "${aws_launch_configuration.master-us-east-1b-masters-lmaj-tk.id}"
  max_size             = 1
  min_size             = 1
  vpc_zone_identifier  = ["${aws_subnet.us-east-1b-lmaj-tk.id}"]

  tag = {
    key                 = "KubernetesCluster"
    value               = "lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "Name"
    value               = "master-us-east-1b.masters.lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    value               = "master-us-east-1b"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/role/master"
    value               = "1"
    propagate_at_launch = true
  }

  metrics_granularity = "1Minute"
  enabled_metrics     = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
}

resource "aws_autoscaling_group" "master-us-east-1c-masters-lmaj-tk" {
  name                 = "master-us-east-1c.masters.lmaj.tk"
  launch_configuration = "${aws_launch_configuration.master-us-east-1c-masters-lmaj-tk.id}"
  max_size             = 1
  min_size             = 1
  vpc_zone_identifier  = ["${aws_subnet.us-east-1c-lmaj-tk.id}"]

  tag = {
    key                 = "KubernetesCluster"
    value               = "lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "Name"
    value               = "master-us-east-1c.masters.lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    value               = "master-us-east-1c"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/role/master"
    value               = "1"
    propagate_at_launch = true
  }

  metrics_granularity = "1Minute"
  enabled_metrics     = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
}

resource "aws_autoscaling_group" "nodes-lmaj-tk" {
  name                 = "nodes.lmaj.tk"
  launch_configuration = "${aws_launch_configuration.nodes-lmaj-tk.id}"
  max_size             = 3
  min_size             = 3
  vpc_zone_identifier  = ["${aws_subnet.us-east-1a-lmaj-tk.id}", "${aws_subnet.us-east-1b-lmaj-tk.id}", "${aws_subnet.us-east-1c-lmaj-tk.id}"]

  tag = {
    key                 = "KubernetesCluster"
    value               = "lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "Name"
    value               = "nodes.lmaj.tk"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/cluster-autoscaler/node-template/label/kops.k8s.io/instancegroup"
    value               = "nodes"
    propagate_at_launch = true
  }

  tag = {
    key                 = "k8s.io/role/node"
    value               = "1"
    propagate_at_launch = true
  }

  metrics_granularity = "1Minute"
  enabled_metrics     = ["GroupDesiredCapacity", "GroupInServiceInstances", "GroupMaxSize", "GroupMinSize", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
}

resource "aws_ebs_volume" "a-etcd-events-lmaj-tk" {
  availability_zone = "us-east-1a"
  size              = 20
  type              = "gp2"
  encrypted         = false

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "a.etcd-events.lmaj.tk"
    "k8s.io/etcd/events"            = "a/a,b,c"
    "k8s.io/role/master"            = "1"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_ebs_volume" "a-etcd-main-lmaj-tk" {
  availability_zone = "us-east-1a"
  size              = 20
  type              = "gp2"
  encrypted         = false

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "a.etcd-main.lmaj.tk"
    "k8s.io/etcd/main"              = "a/a,b,c"
    "k8s.io/role/master"            = "1"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_ebs_volume" "b-etcd-events-lmaj-tk" {
  availability_zone = "us-east-1b"
  size              = 20
  type              = "gp2"
  encrypted         = false

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "b.etcd-events.lmaj.tk"
    "k8s.io/etcd/events"            = "b/a,b,c"
    "k8s.io/role/master"            = "1"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_ebs_volume" "b-etcd-main-lmaj-tk" {
  availability_zone = "us-east-1b"
  size              = 20
  type              = "gp2"
  encrypted         = false

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "b.etcd-main.lmaj.tk"
    "k8s.io/etcd/main"              = "b/a,b,c"
    "k8s.io/role/master"            = "1"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_ebs_volume" "c-etcd-events-lmaj-tk" {
  availability_zone = "us-east-1c"
  size              = 20
  type              = "gp2"
  encrypted         = false

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "c.etcd-events.lmaj.tk"
    "k8s.io/etcd/events"            = "c/a,b,c"
    "k8s.io/role/master"            = "1"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_ebs_volume" "c-etcd-main-lmaj-tk" {
  availability_zone = "us-east-1c"
  size              = 20
  type              = "gp2"
  encrypted         = false

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "c.etcd-main.lmaj.tk"
    "k8s.io/etcd/main"              = "c/a,b,c"
    "k8s.io/role/master"            = "1"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_eip" "us-east-1a-lmaj-tk" {
  vpc = true

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "us-east-1a.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_eip" "us-east-1b-lmaj-tk" {
  vpc = true

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "us-east-1b.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_eip" "us-east-1c-lmaj-tk" {
  vpc = true

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "us-east-1c.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_elb" "api-lmaj-tk" {
  name = "api-lmaj-tk-tk49qp"

  listener = {
    instance_port     = 443
    instance_protocol = "TCP"
    lb_port           = 443
    lb_protocol       = "TCP"
  }

  security_groups = ["${aws_security_group.api-elb-lmaj-tk.id}"]
  subnets         = ["${aws_subnet.utility-us-east-1a-lmaj-tk.id}", "${aws_subnet.utility-us-east-1b-lmaj-tk.id}", "${aws_subnet.utility-us-east-1c-lmaj-tk.id}"]

  health_check = {
    target              = "SSL:443"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    interval            = 10
    timeout             = 5
  }

  idle_timeout = 300

  tags = {
    KubernetesCluster = "lmaj.tk"
    Name              = "api.lmaj.tk"
  }
}

resource "aws_elb" "bastion-lmaj-tk" {
  name = "bastion-lmaj-tk-gk6ba3"

  listener = {
    instance_port     = 22
    instance_protocol = "TCP"
    lb_port           = 22
    lb_protocol       = "TCP"
  }

  security_groups = ["${aws_security_group.bastion-elb-lmaj-tk.id}"]
  subnets         = ["${aws_subnet.utility-us-east-1a-lmaj-tk.id}", "${aws_subnet.utility-us-east-1b-lmaj-tk.id}", "${aws_subnet.utility-us-east-1c-lmaj-tk.id}"]

  health_check = {
    target              = "TCP:22"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    interval            = 10
    timeout             = 5
  }

  idle_timeout = 300

  tags = {
    KubernetesCluster = "lmaj.tk"
    Name              = "bastion.lmaj.tk"
  }
}

resource "aws_iam_instance_profile" "bastions-lmaj-tk" {
  name = "bastions.lmaj.tk"
  role = "${aws_iam_role.bastions-lmaj-tk.name}"
}

resource "aws_iam_instance_profile" "masters-lmaj-tk" {
  name = "masters.lmaj.tk"
  role = "${aws_iam_role.masters-lmaj-tk.name}"
}

resource "aws_iam_instance_profile" "nodes-lmaj-tk" {
  name = "nodes.lmaj.tk"
  role = "${aws_iam_role.nodes-lmaj-tk.name}"
}

resource "aws_iam_role" "bastions-lmaj-tk" {
  name               = "bastions.lmaj.tk"
  assume_role_policy = "${file("${path.module}/data/aws_iam_role_bastions.lmaj.tk_policy")}"
}

resource "aws_iam_role" "masters-lmaj-tk" {
  name               = "masters.lmaj.tk"
  assume_role_policy = "${file("${path.module}/data/aws_iam_role_masters.lmaj.tk_policy")}"
}

resource "aws_iam_role" "nodes-lmaj-tk" {
  name               = "nodes.lmaj.tk"
  assume_role_policy = "${file("${path.module}/data/aws_iam_role_nodes.lmaj.tk_policy")}"
}

resource "aws_iam_role_policy" "additional-nodes-lmaj-tk" {
  name   = "additional.nodes.lmaj.tk"
  role   = "${aws_iam_role.nodes-lmaj-tk.name}"
  policy = "${file("${path.module}/data/aws_iam_role_policy_additional.nodes.lmaj.tk_policy")}"
}

resource "aws_iam_role_policy" "bastions-lmaj-tk" {
  name   = "bastions.lmaj.tk"
  role   = "${aws_iam_role.bastions-lmaj-tk.name}"
  policy = "${file("${path.module}/data/aws_iam_role_policy_bastions.lmaj.tk_policy")}"
}

resource "aws_iam_role_policy" "masters-lmaj-tk" {
  name   = "masters.lmaj.tk"
  role   = "${aws_iam_role.masters-lmaj-tk.name}"
  policy = "${file("${path.module}/data/aws_iam_role_policy_masters.lmaj.tk_policy")}"
}

resource "aws_iam_role_policy" "nodes-lmaj-tk" {
  name   = "nodes.lmaj.tk"
  role   = "${aws_iam_role.nodes-lmaj-tk.name}"
  policy = "${file("${path.module}/data/aws_iam_role_policy_nodes.lmaj.tk_policy")}"
}

resource "aws_internet_gateway" "lmaj-tk" {
  vpc_id = "${aws_vpc.lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_key_pair" "kubernetes-lmaj-tk-cde993206a07dbb3bd3e4ff88debd66e" {
  key_name   = "kubernetes.lmaj.tk-cd:e9:93:20:6a:07:db:b3:bd:3e:4f:f8:8d:eb:d6:6e"
  public_key = "${file("${path.module}/data/aws_key_pair_kubernetes.lmaj.tk-cde993206a07dbb3bd3e4ff88debd66e_public_key")}"
}

resource "aws_launch_configuration" "bastions-lmaj-tk" {
  name_prefix                 = "bastions.lmaj.tk-"
  image_id                    = "ami-b0c6ccca"
  instance_type               = "t2.micro"
  key_name                    = "${aws_key_pair.kubernetes-lmaj-tk-cde993206a07dbb3bd3e4ff88debd66e.id}"
  iam_instance_profile        = "${aws_iam_instance_profile.bastions-lmaj-tk.id}"
  security_groups             = ["${aws_security_group.bastion-lmaj-tk.id}"]
  associate_public_ip_address = true

  root_block_device = {
    volume_type           = "gp2"
    volume_size           = 32
    delete_on_termination = true
  }

  lifecycle = {
    create_before_destroy = true
  }

  enable_monitoring = false
}

resource "aws_launch_configuration" "master-us-east-1a-masters-lmaj-tk" {
  name_prefix                 = "master-us-east-1a.masters.lmaj.tk-"
  image_id                    = "ami-b0c6ccca"
  instance_type               = "t2.micro"
  key_name                    = "${aws_key_pair.kubernetes-lmaj-tk-cde993206a07dbb3bd3e4ff88debd66e.id}"
  iam_instance_profile        = "${aws_iam_instance_profile.masters-lmaj-tk.id}"
  security_groups             = ["${aws_security_group.masters-lmaj-tk.id}"]
  associate_public_ip_address = false
  user_data                   = "${file("${path.module}/data/aws_launch_configuration_master-us-east-1a.masters.lmaj.tk_user_data")}"

  root_block_device = {
    volume_type           = "gp2"
    volume_size           = 64
    delete_on_termination = true
  }

  lifecycle = {
    create_before_destroy = true
  }

  enable_monitoring = false
}

resource "aws_launch_configuration" "master-us-east-1b-masters-lmaj-tk" {
  name_prefix                 = "master-us-east-1b.masters.lmaj.tk-"
  image_id                    = "ami-b0c6ccca"
  instance_type               = "t2.micro"
  key_name                    = "${aws_key_pair.kubernetes-lmaj-tk-cde993206a07dbb3bd3e4ff88debd66e.id}"
  iam_instance_profile        = "${aws_iam_instance_profile.masters-lmaj-tk.id}"
  security_groups             = ["${aws_security_group.masters-lmaj-tk.id}"]
  associate_public_ip_address = false
  user_data                   = "${file("${path.module}/data/aws_launch_configuration_master-us-east-1b.masters.lmaj.tk_user_data")}"

  root_block_device = {
    volume_type           = "gp2"
    volume_size           = 64
    delete_on_termination = true
  }

  lifecycle = {
    create_before_destroy = true
  }

  enable_monitoring = false
}

resource "aws_launch_configuration" "master-us-east-1c-masters-lmaj-tk" {
  name_prefix                 = "master-us-east-1c.masters.lmaj.tk-"
  image_id                    = "ami-b0c6ccca"
  instance_type               = "t2.micro"
  key_name                    = "${aws_key_pair.kubernetes-lmaj-tk-cde993206a07dbb3bd3e4ff88debd66e.id}"
  iam_instance_profile        = "${aws_iam_instance_profile.masters-lmaj-tk.id}"
  security_groups             = ["${aws_security_group.masters-lmaj-tk.id}"]
  associate_public_ip_address = false
  user_data                   = "${file("${path.module}/data/aws_launch_configuration_master-us-east-1c.masters.lmaj.tk_user_data")}"

  root_block_device = {
    volume_type           = "gp2"
    volume_size           = 64
    delete_on_termination = true
  }

  lifecycle = {
    create_before_destroy = true
  }

  enable_monitoring = false
}

resource "aws_launch_configuration" "nodes-lmaj-tk" {
  name_prefix                 = "nodes.lmaj.tk-"
  image_id                    = "ami-b0c6ccca"
  instance_type               = "t2.large"
  key_name                    = "${aws_key_pair.kubernetes-lmaj-tk-cde993206a07dbb3bd3e4ff88debd66e.id}"
  iam_instance_profile        = "${aws_iam_instance_profile.nodes-lmaj-tk.id}"
  security_groups             = ["${aws_security_group.nodes-lmaj-tk.id}"]
  associate_public_ip_address = false
  user_data                   = "${file("${path.module}/data/aws_launch_configuration_nodes.lmaj.tk_user_data")}"

  root_block_device = {
    volume_type           = "gp2"
    volume_size           = 128
    delete_on_termination = true
  }

  lifecycle = {
    create_before_destroy = true
  }

  enable_monitoring = false
}

resource "aws_nat_gateway" "us-east-1a-lmaj-tk" {
  allocation_id = "${aws_eip.us-east-1a-lmaj-tk.id}"
  subnet_id     = "${aws_subnet.utility-us-east-1a-lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "us-east-1a.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_nat_gateway" "us-east-1b-lmaj-tk" {
  allocation_id = "${aws_eip.us-east-1b-lmaj-tk.id}"
  subnet_id     = "${aws_subnet.utility-us-east-1b-lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "us-east-1b.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_nat_gateway" "us-east-1c-lmaj-tk" {
  allocation_id = "${aws_eip.us-east-1c-lmaj-tk.id}"
  subnet_id     = "${aws_subnet.utility-us-east-1c-lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "us-east-1c.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_route" "0-0-0-0--0" {
  route_table_id         = "${aws_route_table.lmaj-tk.id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.lmaj-tk.id}"
}

resource "aws_route" "private-us-east-1a-0-0-0-0--0" {
  route_table_id         = "${aws_route_table.private-us-east-1a-lmaj-tk.id}"
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = "${aws_nat_gateway.us-east-1a-lmaj-tk.id}"
}

resource "aws_route" "private-us-east-1b-0-0-0-0--0" {
  route_table_id         = "${aws_route_table.private-us-east-1b-lmaj-tk.id}"
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = "${aws_nat_gateway.us-east-1b-lmaj-tk.id}"
}

resource "aws_route" "private-us-east-1c-0-0-0-0--0" {
  route_table_id         = "${aws_route_table.private-us-east-1c-lmaj-tk.id}"
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = "${aws_nat_gateway.us-east-1c-lmaj-tk.id}"
}

resource "aws_route53_record" "api-lmaj-tk" {
  name = "api.lmaj.tk"
  type = "A"

  alias = {
    name                   = "${aws_elb.api-lmaj-tk.dns_name}"
    zone_id                = "${aws_elb.api-lmaj-tk.zone_id}"
    evaluate_target_health = false
  }

  zone_id = "/hostedzone/Z3NWKFANMSFP3X"
}

resource "aws_route53_record" "bastion-lmaj-tk" {
  name = "bastion.lmaj.tk"
  type = "A"

  alias = {
    name                   = "${aws_elb.bastion-lmaj-tk.dns_name}"
    zone_id                = "${aws_elb.bastion-lmaj-tk.zone_id}"
    evaluate_target_health = false
  }

  zone_id = "/hostedzone/Z3NWKFANMSFP3X"
}

resource "aws_route_table" "lmaj-tk" {
  vpc_id = "${aws_vpc.lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
    "kubernetes.io/kops/role"       = "public"
  }
}

resource "aws_route_table" "private-us-east-1a-lmaj-tk" {
  vpc_id = "${aws_vpc.lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "private-us-east-1a.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
    "kubernetes.io/kops/role"       = "private-us-east-1a"
  }
}

resource "aws_route_table" "private-us-east-1b-lmaj-tk" {
  vpc_id = "${aws_vpc.lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "private-us-east-1b.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
    "kubernetes.io/kops/role"       = "private-us-east-1b"
  }
}

resource "aws_route_table" "private-us-east-1c-lmaj-tk" {
  vpc_id = "${aws_vpc.lmaj-tk.id}"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "private-us-east-1c.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
    "kubernetes.io/kops/role"       = "private-us-east-1c"
  }
}

resource "aws_route_table_association" "private-us-east-1a-lmaj-tk" {
  subnet_id      = "${aws_subnet.us-east-1a-lmaj-tk.id}"
  route_table_id = "${aws_route_table.private-us-east-1a-lmaj-tk.id}"
}

resource "aws_route_table_association" "private-us-east-1b-lmaj-tk" {
  subnet_id      = "${aws_subnet.us-east-1b-lmaj-tk.id}"
  route_table_id = "${aws_route_table.private-us-east-1b-lmaj-tk.id}"
}

resource "aws_route_table_association" "private-us-east-1c-lmaj-tk" {
  subnet_id      = "${aws_subnet.us-east-1c-lmaj-tk.id}"
  route_table_id = "${aws_route_table.private-us-east-1c-lmaj-tk.id}"
}

resource "aws_route_table_association" "utility-us-east-1a-lmaj-tk" {
  subnet_id      = "${aws_subnet.utility-us-east-1a-lmaj-tk.id}"
  route_table_id = "${aws_route_table.lmaj-tk.id}"
}

resource "aws_route_table_association" "utility-us-east-1b-lmaj-tk" {
  subnet_id      = "${aws_subnet.utility-us-east-1b-lmaj-tk.id}"
  route_table_id = "${aws_route_table.lmaj-tk.id}"
}

resource "aws_route_table_association" "utility-us-east-1c-lmaj-tk" {
  subnet_id      = "${aws_subnet.utility-us-east-1c-lmaj-tk.id}"
  route_table_id = "${aws_route_table.lmaj-tk.id}"
}

resource "aws_security_group" "api-elb-lmaj-tk" {
  name        = "api-elb.lmaj.tk"
  vpc_id      = "${aws_vpc.lmaj-tk.id}"
  description = "Security group for api ELB"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "api-elb.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_security_group" "bastion-elb-lmaj-tk" {
  name        = "bastion-elb.lmaj.tk"
  vpc_id      = "${aws_vpc.lmaj-tk.id}"
  description = "Security group for bastion ELB"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "bastion-elb.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_security_group" "bastion-lmaj-tk" {
  name        = "bastion.lmaj.tk"
  vpc_id      = "${aws_vpc.lmaj-tk.id}"
  description = "Security group for bastion"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "bastion.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_security_group" "masters-lmaj-tk" {
  name        = "masters.lmaj.tk"
  vpc_id      = "${aws_vpc.lmaj-tk.id}"
  description = "Security group for masters"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "masters.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_security_group" "nodes-lmaj-tk" {
  name        = "nodes.lmaj.tk"
  vpc_id      = "${aws_vpc.lmaj-tk.id}"
  description = "Security group for nodes"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "nodes.lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_security_group_rule" "all-master-to-master" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.masters-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.masters-lmaj-tk.id}"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
}

resource "aws_security_group_rule" "all-master-to-node" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.nodes-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.masters-lmaj-tk.id}"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
}

resource "aws_security_group_rule" "all-node-to-node" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.nodes-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.nodes-lmaj-tk.id}"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
}

resource "aws_security_group_rule" "api-elb-egress" {
  type              = "egress"
  security_group_id = "${aws_security_group.api-elb-lmaj-tk.id}"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "bastion-egress" {
  type              = "egress"
  security_group_id = "${aws_security_group.bastion-lmaj-tk.id}"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "bastion-elb-egress" {
  type              = "egress"
  security_group_id = "${aws_security_group.bastion-elb-lmaj-tk.id}"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "bastion-to-master-ssh" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.masters-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.bastion-lmaj-tk.id}"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "bastion-to-node-ssh" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.nodes-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.bastion-lmaj-tk.id}"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "https-api-elb-0-0-0-0--0" {
  type              = "ingress"
  security_group_id = "${aws_security_group.api-elb-lmaj-tk.id}"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "https-elb-to-master" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.masters-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.api-elb-lmaj-tk.id}"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "master-egress" {
  type              = "egress"
  security_group_id = "${aws_security_group.masters-lmaj-tk.id}"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "node-egress" {
  type              = "egress"
  security_group_id = "${aws_security_group.nodes-lmaj-tk.id}"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "node-to-master-tcp-1-2379" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.masters-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.nodes-lmaj-tk.id}"
  from_port                = 1
  to_port                  = 2379
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "node-to-master-tcp-2382-4000" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.masters-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.nodes-lmaj-tk.id}"
  from_port                = 2382
  to_port                  = 4000
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "node-to-master-tcp-4003-65535" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.masters-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.nodes-lmaj-tk.id}"
  from_port                = 4003
  to_port                  = 65535
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "node-to-master-udp-1-65535" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.masters-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.nodes-lmaj-tk.id}"
  from_port                = 1
  to_port                  = 65535
  protocol                 = "udp"
}

resource "aws_security_group_rule" "ssh-elb-to-bastion" {
  type                     = "ingress"
  security_group_id        = "${aws_security_group.bastion-lmaj-tk.id}"
  source_security_group_id = "${aws_security_group.bastion-elb-lmaj-tk.id}"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
}

resource "aws_security_group_rule" "ssh-external-to-bastion-elb-0-0-0-0--0" {
  type              = "ingress"
  security_group_id = "${aws_security_group.bastion-elb-lmaj-tk.id}"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_subnet" "us-east-1a-lmaj-tk" {
  vpc_id            = "${aws_vpc.lmaj-tk.id}"
  cidr_block        = "172.20.32.0/19"
  availability_zone = "us-east-1a"

  tags = {
    KubernetesCluster                 = "lmaj.tk"
    Name                              = "us-east-1a.lmaj.tk"
    SubnetType                        = "Private"
    "kubernetes.io/cluster/lmaj.tk"   = "owned"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "us-east-1b-lmaj-tk" {
  vpc_id            = "${aws_vpc.lmaj-tk.id}"
  cidr_block        = "172.20.64.0/19"
  availability_zone = "us-east-1b"

  tags = {
    KubernetesCluster                 = "lmaj.tk"
    Name                              = "us-east-1b.lmaj.tk"
    SubnetType                        = "Private"
    "kubernetes.io/cluster/lmaj.tk"   = "owned"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "us-east-1c-lmaj-tk" {
  vpc_id            = "${aws_vpc.lmaj-tk.id}"
  cidr_block        = "172.20.96.0/19"
  availability_zone = "us-east-1c"

  tags = {
    KubernetesCluster                 = "lmaj.tk"
    Name                              = "us-east-1c.lmaj.tk"
    SubnetType                        = "Private"
    "kubernetes.io/cluster/lmaj.tk"   = "owned"
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "utility-us-east-1a-lmaj-tk" {
  vpc_id            = "${aws_vpc.lmaj-tk.id}"
  cidr_block        = "172.20.0.0/22"
  availability_zone = "us-east-1a"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "utility-us-east-1a.lmaj.tk"
    SubnetType                      = "Utility"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
    "kubernetes.io/role/elb"        = "1"
  }
}

resource "aws_subnet" "utility-us-east-1b-lmaj-tk" {
  vpc_id            = "${aws_vpc.lmaj-tk.id}"
  cidr_block        = "172.20.4.0/22"
  availability_zone = "us-east-1b"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "utility-us-east-1b.lmaj.tk"
    SubnetType                      = "Utility"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
    "kubernetes.io/role/elb"        = "1"
  }
}

resource "aws_subnet" "utility-us-east-1c-lmaj-tk" {
  vpc_id            = "${aws_vpc.lmaj-tk.id}"
  cidr_block        = "172.20.8.0/22"
  availability_zone = "us-east-1c"

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "utility-us-east-1c.lmaj.tk"
    SubnetType                      = "Utility"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
    "kubernetes.io/role/elb"        = "1"
  }
}

resource "aws_vpc" "lmaj-tk" {
  cidr_block           = "172.20.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_vpc_dhcp_options" "lmaj-tk" {
  domain_name         = "ec2.internal"
  domain_name_servers = ["AmazonProvidedDNS"]

  tags = {
    KubernetesCluster               = "lmaj.tk"
    Name                            = "lmaj.tk"
    "kubernetes.io/cluster/lmaj.tk" = "owned"
  }
}

resource "aws_vpc_dhcp_options_association" "lmaj-tk" {
  vpc_id          = "${aws_vpc.lmaj-tk.id}"
  dhcp_options_id = "${aws_vpc_dhcp_options.lmaj-tk.id}"
}

terraform = {
  required_version = ">= 0.9.3"
}

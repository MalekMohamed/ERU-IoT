<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>ERU - Atmospheric Water Control</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="An IoT Project to control over Atmospheric Air Condenser" name="description"/>
    <meta content="Malek Mohamed" name="author"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <!-- App favicon -->
    <link rel="shortcut icon" href="assets/images/favicon.ico">

    <!-- App css -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
    <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css"/>
    <link href="assets/css/app.min.css" rel="stylesheet" type="text/css"/>

</head>

<body>

<!-- Begin page -->
<div id="wrapper">

    <!-- Topbar Start -->
    <div class="navbar-custom">
        <ul class="list-unstyled topnav-menu float-right mb-0">
            <li class="dropdown notification-list">
                <a class="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown"
                   href="#" role="button" aria-haspopup="false" aria-expanded="false">

                    <span class="pro-user-name ml-1">
                                Welcome <i class="mdi mdi-chevron-down"></i>
                            </span>
                </a>
                <div class="dropdown-menu dropdown-menu-right profile-dropdown ">
                    <!-- item-->
                    <div class="dropdown-header noti-title">
                        <h6 class="text-overflow m-0">Welcome !</h6>
                    </div>

                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item notify-item">
                        <i class="fe-user"></i>
                        <span>My Account</span>
                    </a>

                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item notify-item">
                        <i class="fe-settings"></i>
                        <span>Settings</span>
                    </a>

                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item notify-item">
                        <i class="fe-lock"></i>
                        <span>Lock Screen</span>
                    </a>

                    <div class="dropdown-divider"></div>

                    <!-- item-->
                    <a href="javascript:void(0);" class="dropdown-item notify-item">
                        <i class="fe-log-out"></i>
                        <span>Logout</span>
                    </a>

                </div>
            </li>
        </ul>

        <!-- LOGO -->
        <div class="logo-box">
            <a href="index.html" class="logo text-center">
                        <span class="logo-lg">
                            <span class="logo-lg-text-light">ERU</span>
                        </span>
                <span class="logo-sm">
                            <span class="logo-sm-text-dark">ERU</span>
                        </span>
            </a>
        </div>

        <ul class="list-unstyled topnav-menu topnav-menu-left m-0">
            <li>
                <button class="button-menu-mobile waves-effect waves-light">
                    <i class="fe-menu"></i>
                </button>
            </li>

        </ul>
    </div>
    <!-- end Topbar -->

    <!-- ========== Left Sidebar Start ========== -->
    <div class="left-side-menu">

        <div class="slimscroll-menu">

            <!--- Sidemenu -->
            <div id="sidebar-menu">

                <ul class="metismenu" id="side-menu">

                    <li class="menu-title">Navigation</li>

                    <li>
                        <a href="./">
                            <i class="fe-airplay"></i>
                            <span> Dashboard </span>
                        </a>

                    </li>

                    <li>
                        <a href="./logs">
                            <i class="fe-file-text"></i>
                            <span> Logs </span>
                        </a>
                    </li>

                </ul>

            </div>
            <!-- End Sidebar -->

            <div class="clearfix"></div>

        </div>
        <!-- Sidebar -left -->

    </div>
    <!-- Left Sidebar End -->

    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="content-page">
        <div class="content">

            <!-- Start Content-->
            <div class="container-fluid">

                <!-- start page title -->
                <div class="row">
                    <div class="col-12">
                        <div class="page-title-box">
                            <h4 class="page-title">Events</h4>
                        </div>
                    </div>
                </div>
                <!-- end page title -->

                <div class="row ajax-row">
                    <?php
                    require 'handler/Events.php';
                    foreach (json_decode($Events->getEvent('logs'), true) as $event) {
                        ?>
                        <div class="col-md-4">
                            <div class="card text-white bg-dark text-xs-center">
                                <div class="card-body">
                                    <code>
                                        {
                                        <br>
                                        <?php
                                        unset($event[0]);
                                        foreach ($event as $key => $value) {
                                            if (!intval($key)) {
                                                echo '&nbsp;"' . $key . '":' . $value . '<br />';
                                            }
                                        }
                                        ?>
                                        }
                                    </code>

                                </div>
                            </div>
                        </div>
                        <?php
                    }
                    ?>
                    <!-- end row-->
<button onclick="resetEvents();" type="button" class="btn btn-block btn-lg btn-danger waves-effect waves-light"><i class="fas fa-trash"></i> Reset</button>

                </div> <!-- container -->

            </div> <!-- content -->

            <!-- Footer Start -->
            <footer class="footer">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-6">
                            2015 - 2019 &copy; UBold theme by <a href="#">Coderthemes</a>
                        </div>
                        <div class="col-md-6">
                            <div class="text-md-right footer-links d-none d-sm-block">
                                <a href="javascript:void(0);">About Us</a>
                                <a href="javascript:void(0);">Help</a>
                                <a href="javascript:void(0);">Contact Us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <!-- end Footer -->

        </div>

        <!-- ============================================================== -->
        <!-- End Page content -->
        <!-- ============================================================== -->


    </div>
    <!-- END wrapper -->


    <!-- Right bar overlay-->
    <div class="rightbar-overlay"></div>

    <!-- Vendor js -->
    <script src="assets/js/vendor.min.js"></script>

    <script type="application/javascript">
        function getEvents() {
            $.ajax({
                url: 'handler/Events.php',
                type: 'post',
                data: {event_name: 'logs', request: 'getEvents'},
                success: function (res) {
                    var response = $.parseJSON(res);
                    for (var prop in response) {
                        // skip loop if the property is from prototype
                        if (!response.hasOwnProperty(prop)) continue;
                        var demo = ' <div class="col-md-4">\n' +
                            '                            <div class="card text-white bg-dark text-xs-center">\n' +
                            '                                <div class="card-body">\n' +
                            '                                    <code>\n' +
                            '                                        {\n' +
                            '                                        <br>\n' +
                            '                                        {\n' +
                            '                                        "id": '+response[prop].id+'\n' +
                            '                                        "event_id": \'+response[prop].event_id+\'\n' +
                            '                                        "event_name": \'+response[prop].event_name+\'\n' +
                            '                                        "event_data": \'+response[prop].event_data+\'\n' +
                            '                                        }\n' +
                            '                                        }\n' +
                            '                                    </code>\n' +
                            '\n' +
                            '                                </div>\n' +
                            '                            </div>\n' +
                            '                        </div>';
                    }
                }
            });
        }
        function resetEvents() {
            $.ajax({
                url: 'handler/Events.php',
                type: 'post',
                data: {request: 'reset'},
                success: function (res) {
                  if(res == 'success') {
                      location.reload(true);
                  }  
                }
            });
        }
    </script>
    <!-- App js-->
    <script src="assets/js/app.min.js"></script>

</body>

</html>
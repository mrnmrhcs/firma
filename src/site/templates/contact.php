<!DOCTYPE html>
<html lang="en">
<head>
    <title><?php echo $site->title() ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="<?php echo $site->description() ?>">
    <meta name="keywords" content="<?php echo $site->keywords() ?>">
    <meta name="msapplication-TileColor" content="#062299">
    <link rel="shortcut icon" sizes="16x16 24x24 32x32 48x48 64x64" href="/favicon.ico">
    <!--build:css assets/css/main.min.css-->
    <link rel="stylesheet" type="text/css" href="/assets/css/main.min.css">
    <!--endbuild-->
</head>
<body id="contact">
    <?php snippet('header') ?>

    <main>
        <div class="container-fluid contact">
            <div class="row">
                <div class="col-12 col-sm-8 offset-sm-2 col-md-9 offset-md-1 col-lg-7 offset-lg-2">
                    <div class="title">
                        <h1><?php echo $page->title() ?></h1>
                    </div>
                    <div class="intro">
                        <p><?php echo $page->text() ?></p>
                    </div>
                    <div class="content">
                        <div class="row">
                            <div class="col-12 col-md-6">
                                <div class="contact-channel">
                                    <p>Tel:&nbsp;<?php echo $page->phone() ?></p>
                                    <p>Fax:&nbsp;<?php echo $page->fax() ?></p>
                                    <p><a href="mailto:<?php echo $page->email() ?>"><?php echo $page->email() ?></a></p>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="contact-address">
                                    <p><?php echo $page->company() ?></p>
                                    <p><?php echo $page->street() ?></p>
                                    <p><?php echo $page->zip() ?>&nbsp;<?php echo $page->location() ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <?php snippet('footer') ?>
    <!--build:js js/main.min.js -->
    <script src="../assets/js/main.min.js"></script>
    <!-- endbuild -->
</body>
</html>

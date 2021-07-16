<?php

if ($root = $pages->findOpen()) {
  $items = $root->children()->listed();
}

if ($items and $items->count()) : ?>
<navigation-sub class="snippet">
  <div class="container">
    <div class="navigation-sub">
      <nav class="menu">
        <?php snippet('navigation/sub/partials/list/index', ['items' => $items]) ?>
      </nav>
    </div>
  </div>
</navigation-sub>
<?php endif ?>

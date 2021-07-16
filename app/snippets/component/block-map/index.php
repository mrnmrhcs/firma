<block-map class="snippet">
  <?php
    echo '<script class="jsData" type="application/json">';
    $data = $page->location_data()->yaml();
    $geo = ['lat' => $data['lat'], 'lon' => $data['lon']];
    echo json_encode($geo);
    echo '</script>';
    ?>
  <div class="container">
    <div id="map"></div>
  </div>
</block-map>

<select class="select select_language" onchange="window.location.href = this.value">
  <?php foreach ($kirby->languages() as $language): ?>
  <option value="<?= $page->url($language->code()) ?>"<?= e($kirby->language() == $language, ' selected="selected"') ?> hreflang="<?= $language->code() ?>"><?= html($language->name()) ?></option>
  <?php endforeach ?>
</select>

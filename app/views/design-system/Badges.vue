<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Variants</h3>
      <div class="ds-row ds-row--gap" style="align-items: center;">
        <div>
          <p class="ds-label">new</p>
          <Badge variant="new">New</Badge>
        </div>
        <div>
          <p class="ds-label">hot</p>
          <Badge variant="hot">Recently Added</Badge>
        </div>
        <div>
          <p class="ds-label">rating</p>
          <Badge variant="rating">TV-MA</Badge>
        </div>
        <div>
          <p class="ds-label">quality</p>
          <Badge variant="quality">HD</Badge>
        </div>
        <div>
          <p class="ds-label">leaving</p>
          <Badge variant="leaving">Leaving Soon</Badge>
        </div>
        <div>
          <p class="ds-label">default</p>
          <Badge variant="default">Label</Badge>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Sizes</h3>
      <div class="ds-row ds-row--gap" style="align-items: center;">
        <div>
          <p class="ds-label">default</p>
          <div style="display: flex; gap: var(--dm-8); align-items: center;">
            <Badge variant="new">New</Badge>
            <Badge variant="hot">Recently Added</Badge>
            <Badge variant="rating">TV-MA</Badge>
            <Badge variant="quality">HD</Badge>
          </div>
        </div>
        <div>
          <p class="ds-label">small</p>
          <div style="display: flex; gap: var(--dm-8); align-items: center;">
            <Badge variant="new" size="small">New</Badge>
            <Badge variant="hot" size="small">Recently Added</Badge>
            <Badge variant="rating" size="small">TV-MA</Badge>
            <Badge variant="quality" size="small">HD</Badge>
          </div>
        </div>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">In context</h3>
      <div style="display: flex; align-items: center; gap: var(--dm-8);">
        <Badge variant="new">New</Badge>
        <Badge variant="rating">TV-MA</Badge>
        <span class="caption-1-medium" style="color: var(--color-text-primary);">3 Seasons</span>
        <Badge variant="quality">HD</Badge>
      </div>
    </div>

  </div>
</template>

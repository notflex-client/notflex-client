<template>
  <div class="ds-section">

    <!-- Landing Header -->
    <div class="ds-block">
      <h3 class="ds-block__title">Landing Page Header</h3>
      <p class="ds-block__desc">Solid dark bg · no nav · language dropdown + sign in</p>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppHeader :sticky="false">
          <template #logo>
            <span style="font-family: var(--font-family-logo); font-size: 32px; color: var(--color-action-brand); letter-spacing: 2px;">
              NETFLIX
            </span>
          </template>
          <template #action>
            <Dropdown
              :model-value="'en'"
              :options="[{ label: 'English', value: 'en' }, { label: 'Vietnamese', value: 'vi' }]"
              size="small"
              style="width: 130px;"
            />
            <Button variant="brand" size="small">Sign In</Button>
          </template>
        </AppHeader>
      </div>
    </div>

    <!-- Home Header -->
    <div class="ds-block">
      <h3 class="ds-block__title">Home Page Header</h3>
      <p class="ds-block__desc">Solid bg · nav links · search + notifications + avatar</p>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppHeader :sticky="false">
          <template #logo>
            <span style="font-family: var(--font-family-logo); font-size: 28px; color: var(--color-action-brand); letter-spacing: 2px; margin-right: 8px;">
              NETFLIX
            </span>
          </template>
          <template #navigation>
            <a v-for="item in navItems" :key="item" href="#" class="caption-1-regular hd-nav-link">{{ item }}</a>
          </template>
          <template #action>
            <!-- Search -->
            <IconButton variant="ghost" size="small">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </IconButton>
            <!-- Notification -->
            <IconButton variant="ghost" size="small">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </IconButton>
            <!-- Avatar -->
            <div style="width: 32px; height: 32px; border-radius: 4px; background: var(--secondary-red-100); cursor: pointer;" />
          </template>
        </AppHeader>
      </div>
    </div>

    <!-- Transparent (home hero) -->
    <div class="ds-block">
      <h3 class="ds-block__title">Transparent (Home Hero)</h3>
      <p class="ds-block__desc">Starts with gradient fade · becomes solid on scroll</p>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden; background: linear-gradient(to bottom, #1a1a2e, #16213e);">
        <AppHeader :sticky="false" :transparent="true">
          <template #logo>
            <span style="font-family: var(--font-family-logo); font-size: 28px; color: var(--color-action-brand); letter-spacing: 2px; margin-right: 8px;">
              NETFLIX
            </span>
          </template>
          <template #navigation>
            <a v-for="item in navItems" :key="item" href="#" class="caption-1-regular hd-nav-link">{{ item }}</a>
          </template>
          <template #action>
            <IconButton variant="ghost" size="small">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </IconButton>
            <div style="width: 32px; height: 32px; border-radius: 4px; background: var(--secondary-red-100); cursor: pointer;" />
          </template>
        </AppHeader>
      </div>
    </div>


    <!-- Footers -->
    <div class="ds-block">
      <h3 class="ds-block__title">Footer — Landing</h3>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppFooter variant="landing" />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Footer — Authentication</h3>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppFooter variant="auth" />
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">Footer — Home</h3>
      <div style="border: 1px solid var(--color-border-subtle); border-radius: 8px; overflow: hidden;">
        <AppFooter variant="home" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const navItems = ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List', 'Browse by Languages']
</script>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.hd-nav-link {
  color: token("color-text-primary");
  text-decoration: none;
  white-space: nowrap;
}
</style>

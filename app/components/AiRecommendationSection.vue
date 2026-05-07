<script setup lang="ts">
const { mapMovie } = useMovieCatalog()
const { listRecommendations } = useRecommendations()

const { data } = await useAsyncData('ai-recommendations', () =>
  listRecommendations().catch(() => ({ items: [], source: 'fallback-top-rated' }))
)

const items = computed(() => data.value?.items?.map(movie => ({
  ...mapMovie(movie),
  badge: data.value?.source === 'mock-content-based' ? 'AI Match' : 'Top pick',
})) ?? [])
</script>

<template>
  <section v-if="items.length" class="ai-recommendation">
    <div class="ai-recommendation__heading">
      <span class="title-4-medium">Gợi ý AI dành riêng cho bạn</span>
      <span class="caption-2-regular ai-recommendation__badge">Content-based filtering demo</span>
    </div>
    <MovieBlock :items="items" />
  </section>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;

.ai-recommendation {
  display: flex;
  flex-direction: column;
  gap: token("dm-12");

  &__heading {
    display: flex;
    align-items: center;
    gap: token("dm-12");
    padding: 0 token("layout-margin");
  }

  &__badge {
    color: token("color-action-brand");
    border: 1px solid currentColor;
    border-radius: 999px;
    padding: 3px 10px;
  }
}
</style>

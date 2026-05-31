<script setup lang="ts">
const { mapMovie } = useMovieCatalog()
const { listRecommendations } = useRecommendations()

const { data } = await useAsyncData('ai-recommendations', () =>
  listRecommendations().catch(() => ({ items: [], source: 'fallback-top-rated' })),
  { server: false }
)

function getBadge(source: string | undefined) {
  if (source === 'ai-gemini')             return 'AI Match'
  if (source === 'rule-based-fallback')   return 'For you'
  if (source === 'mock-content-based')    return 'For you'
  return 'Top pick'
}

function getSourceLabel(source: string | undefined) {
  if (source === 'ai-gemini')           return 'Gemini AI'
  if (source === 'rule-based-fallback') return 'Content-based'
  if (source === 'mock-content-based')  return 'Content-based'
  return 'Trending'
}

const items = computed(() => data.value?.items?.map(movie => ({
  ...mapMovie(movie),
  badge: getBadge(data.value?.source),
})) ?? [])
</script>

<template>
  <section v-if="items.length" class="ai-recommendation">
    <div class="ai-recommendation__heading">
      <span class="title-4-medium">Gợi ý dành riêng cho bạn</span>
      <span class="caption-2-regular ai-recommendation__badge">{{ getSourceLabel(data?.source) }}</span>
    </div>
    <MovieBlock :items="items" />
  </section>
</template>

<style scoped lang="scss">
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

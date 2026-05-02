<script setup lang="ts">
export interface FdmEpisode {
  number:      number
  title:       string
  description: string
  duration:    string
  image?:      string
}

export interface FdmSeason {
  value:    string
  label:    string
  episodes: FdmEpisode[]
}

export interface FdmMoreItem {
  image:       string
  rating?:     string
  year?:       string
  description: string
}

export interface FdmTrailer {
  image: string
  title: string
}

export interface FdmData {
  id?:                  string
  type:                 'series' | 'movie'
  title:                string
  image:                string
  year:                 string
  rating:               string       // 'TV-MA' | 'PG-13' | ...
  quality?:             string       // 'HD' | '4K+HDR'
  isNew?:               boolean
  rank?:                string       // '#2 in TV Shows Today'
  description:          string
  cast:                 string[]
  genres:               string[]
  tags?:                string[]     // 'Dark', 'Suspenseful'
  director?:            string       // movie only
  maturity?:            string[]     // ['smoking', 'violence']
  // series only
  seasons?:             FdmSeason[]
  // movie only
  duration?:            string
  // shared optional
  moreLikeThis?:        FdmMoreItem[]
  trailers?:            FdmTrailer[]
}

const props  = defineProps<{ data: FdmData }>()
const emit   = defineEmits<{ close: [] }>()
const router = useRouter()

function play() {
  emit('close')
  router.push(`/watch/${props.data.id ?? 'demo'}`)
}

const isSeries = computed(() => props.data.type === 'series')

const selectedSeason = ref(props.data.seasons?.[0]?.value ?? '')
const currentEpisodes = computed(() =>
  props.data.seasons?.find(s => s.value === selectedSeason.value)?.episodes ?? []
)

const seasonOptions = computed(() =>
  (props.data.seasons ?? []).map(s => ({ value: s.value, label: s.label }))
)

const showAllMoreLike = ref(false)
const moreLikeVisible = computed(() => {
  const items = props.data.moreLikeThis ?? []
  return showAllMoreLike.value ? items : items.slice(0, 6)
})

// scroll lock
onMounted(() => { document.body.style.overflow = 'hidden' })
onUnmounted(() => { document.body.style.overflow = '' })

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div class="film-detail-backdrop" @click="onBackdropClick">
      <div class="film-detail" role="dialog" :aria-label="data.title">

        <!-- ── Close ──────────────────────────────────────────── -->
        <IconButton variant="ghost" shape="circle" size="small" class="film-detail__close" aria-label="Close" @click="emit('close')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </IconButton>

        <!-- ── Poster ─────────────────────────────────────────── -->
        <div class="film-detail__poster">
          <img :src="data.image" class="film-detail__poster-img" :alt="data.title">
          <div class="film-detail__poster-overlay">
            <div class="film-detail__poster-meta">
              <!-- Netflix N + type label -->
              <div class="film-detail__poster-badge">
                <svg class="film-detail__netflix-n" viewBox="0 0 111 152" fill="none" aria-hidden="true">
                  <path d="M0 0h28.5l54 139.5V0H111v152H83L28.5 12V152H0V0Z" fill="#E50914"/>
                </svg>
                <span class="caption-1-medium film-detail__type-label">{{ isSeries ? 'SERIES' : 'FILM' }}</span>
              </div>
              <span class="h1-bold film-detail__title">{{ data.title }}</span>

              <!-- Actions -->
              <div class="film-detail__actions">
                <Button variant="light" size="medium" class="film-detail__play-btn" @click="play()">
                  <template #leading-icon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M5 3l14 9-14 9V3Z"/>
                    </svg>
                  </template>
                  Play
                </Button>
                <IconButton variant="outline" shape="circle" size="medium" aria-label="Add to list">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </IconButton>
                <IconButton variant="outline" shape="circle" size="medium" aria-label="Like">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h11.2a2 2 0 0 0 1.96-1.6l1.6-7A2 2 0 0 0 16.8 11H13V6a3 3 0 0 0-3-3L7 11"/>
                  </svg>
                </IconButton>
                <IconButton variant="outline" shape="circle" size="medium" aria-label="Share">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                  </svg>
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Body ───────────────────────────────────────────── -->
        <div class="film-detail__body">

          <!-- Info row: description + metadata -->
          <div class="film-detail__info">
            <div class="film-detail__info-left">
              <!-- Badges row -->
              <div class="film-detail__badges">
                <Badge v-if="data.isNew" variant="new">New</Badge>
                <span v-if="data.rank" class="caption-1-medium film-detail__rank">{{ data.rank }}</span>
                <span class="caption-1-medium film-detail__year">{{ data.year }}</span>
                <Badge variant="rating">{{ data.rating }}</Badge>
                <span v-if="isSeries && data.seasons" class="caption-1-medium film-detail__seasons-count">
                  {{ data.seasons.length }} Season{{ data.seasons.length > 1 ? 's' : '' }}
                </span>
                <span v-if="!isSeries && data.duration" class="caption-1-medium film-detail__duration">{{ data.duration }}</span>
                <Badge v-if="data.quality" variant="quality">{{ data.quality }}</Badge>
              </div>
              <span class="body-regular film-detail__desc">{{ data.description }}</span>
            </div>

            <div class="film-detail__info-right">
              <div class="film-detail__meta-row">
                <span class="small-body-regular film-detail__meta-label">Cast:</span>
                <span class="small-body-regular film-detail__meta-value">{{ data.cast.slice(0, 4).join(', ') }}{{ data.cast.length > 4 ? ', more' : '' }}</span>
              </div>
              <div class="film-detail__meta-row">
                <span class="small-body-regular film-detail__meta-label">Genres:</span>
                <span class="small-body-regular film-detail__meta-value">{{ data.genres.join(', ') }}</span>
              </div>
              <div v-if="data.tags?.length" class="film-detail__meta-row">
                <span class="small-body-regular film-detail__meta-label">This {{ isSeries ? 'show' : 'film' }} is:</span>
                <span class="small-body-regular film-detail__meta-value">{{ data.tags.join(', ') }}</span>
              </div>
              <div v-if="!isSeries && data.director" class="film-detail__meta-row">
                <span class="small-body-regular film-detail__meta-label">Director:</span>
                <span class="small-body-regular film-detail__meta-value">{{ data.director }}</span>
              </div>
            </div>
          </div>

          <!-- ── Episodes (series only) ──────────────────────── -->
          <section v-if="isSeries && data.seasons?.length" class="film-detail__episodes">
            <div class="film-detail__episodes-header">
              <span class="title-3-medium film-detail__section-title">Episodes</span>
              <Dropdown
                v-if="seasonOptions.length > 1"
                v-model="selectedSeason"
                :options="seasonOptions"
                size="small"
              />
              <span v-else class="body-medium film-detail__season-label">{{ data.title }}</span>
            </div>
            <div class="film-detail__episode-list">
              <EpisodeItem
                v-for="ep in currentEpisodes"
                :key="ep.number"
                :number="ep.number"
                :title="ep.title"
                :description="ep.description"
                :duration="ep.duration"
                :image="ep.image ?? ''"
              />
            </div>
          </section>

          <!-- ── More Like This ──────────────────────────────── -->
          <section v-if="data.moreLikeThis?.length" class="film-detail__more">
            <span class="title-3-medium film-detail__section-title">More Like This</span>
            <div class="film-detail__more-grid">
              <div
                v-for="(item, i) in moreLikeVisible"
                :key="i"
                class="film-detail__more-item"
              >
                <div class="film-detail__more-thumb">
                  <img v-if="item.image" :src="item.image" class="film-detail__more-img" alt="">
                  <IconButton variant="outline" shape="circle" size="small" class="film-detail__more-add" aria-label="Add to list">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </IconButton>
                </div>
                <div class="film-detail__more-info">
                  <div class="film-detail__more-meta">
                    <Badge variant="rating">{{ item.rating ?? 'TV-MA' }}</Badge>
                    <span class="caption-1-regular film-detail__more-year">{{ item.year ?? '2024' }}</span>
                    <Badge variant="quality">HD</Badge>
                  </div>
                  <span class="small-body-regular film-detail__more-desc">{{ item.description }}</span>
                </div>
              </div>
            </div>
            <IconButton
              v-if="(data.moreLikeThis?.length ?? 0) > 6"
              variant="outline"
              shape="circle"
              size="medium"
              class="film-detail__more-toggle"
              :aria-label="showAllMoreLike ? 'Show less' : 'Show more'"
              @click="showAllMoreLike = !showAllMoreLike"
            >
              <svg
                width="28" height="28" viewBox="0 0 24 24" fill="none"
                :style="{ transform: showAllMoreLike ? 'rotate(180deg)' : 'none' }"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </IconButton>
          </section>

          <!-- ── Trailers & More ─────────────────────────────── -->
          <section v-if="data.trailers?.length" class="film-detail__trailers">
            <span class="title-3-medium film-detail__section-title">Trailers &amp; More</span>
            <div class="film-detail__trailers-grid">
              <div v-for="(tr, i) in data.trailers" :key="i" class="film-detail__trailer-item">
                <div class="film-detail__trailer-thumb">
                  <img v-if="tr.image" :src="tr.image" class="film-detail__trailer-img" alt="">
                  <div class="film-detail__trailer-play">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M5 3l14 9-14 9V3Z"/>
                    </svg>
                  </div>
                </div>
                <span class="small-body-regular film-detail__trailer-title">{{ tr.title }}</span>
              </div>
            </div>
          </section>

          <!-- ── About ──────────────────────────────────────────── -->
          <section class="film-detail__about">
            <span class="title-3-medium film-detail__section-title">About {{ data.title }}</span>
            <div v-if="!isSeries && data.director" class="film-detail__about-row">
              <span class="small-body-regular film-detail__about-label">Director:</span>
              <span class="small-body-regular film-detail__about-value">{{ data.director }}</span>
            </div>
            <div class="film-detail__about-row">
              <span class="small-body-regular film-detail__about-label">Cast:</span>
              <span class="small-body-regular film-detail__about-value">{{ data.cast.join(', ') }}</span>
            </div>
            <div class="film-detail__about-row">
              <span class="small-body-regular film-detail__about-label">Genres:</span>
              <span class="small-body-regular film-detail__about-value">{{ data.genres.join(', ') }}</span>
            </div>
            <div v-if="data.maturity?.length" class="film-detail__about-row">
              <span class="small-body-regular film-detail__about-label">Maturity rating:</span>
              <span class="small-body-regular film-detail__about-value">
                <Badge variant="rating">{{ data.rating }}</Badge>
                {{ data.maturity.join(', ') }}
              </span>
            </div>
          </section>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use "~/assets/scss/tools/token" as *;
@use "~/assets/scss/mixins/typography" as *;

// ── Transition ───────────────────────────────────────────────
.film-detail-fade-enter-active,
.film-detail-fade-leave-active {
  transition: opacity 0.25s ease;
  .film-detail { transition: transform 0.25s ease; }
}

.film-detail-fade-enter-from,
.film-detail-fade-leave-to {
  opacity: 0;
  .film-detail { transform: translateY(24px) scale(0.97); }
}

// ── Backdrop ─────────────────────────────────────────────────
.film-detail-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: token("dm-48") token("dm-16") token("dm-80");
}

// ── Modal panel ──────────────────────────────────────────────
.film-detail {
  position: relative;
  width: 100%;
  max-width: 850px;
  background-color: token("grey-900");
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;

  // ── Close button ───────────────────────────────────────────
  &__close {
    position: absolute;
    top: token("dm-12");
    right: token("dm-12");
    z-index: 10;
    background-color: token("grey-900");

    &:hover { background-color: token("grey-700"); }
  }

  // ── Poster ─────────────────────────────────────────────────
  &__poster {
    position: relative;
    width: 100%;
    aspect-ratio: 2.4 / 1;
    overflow: hidden;
    background-color: token("grey-800");
  }

  &__poster-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__poster-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      token("grey-900") 0%,
      rgba(20, 20, 20, 0.6) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    display: flex;
    align-items: flex-end;
    padding: token("dm-24") token("dm-32");
  }

  &__poster-meta {
    display: flex;
    flex-direction: column;
    gap: token("dm-16");
    width: 100%;
  }

  &__poster-badge {
    display: flex;
    align-items: center;
    gap: token("dm-8");
  }

  &__netflix-n {
    width: 20px;
    height: 28px;
    flex-shrink: 0;
  }

  &__type-label {
    color: token("color-text-secondary");
    letter-spacing: 3px;
  }

  &__title {
    color: token("color-text-primary");
    display: block;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: token("dm-8");
  }

  &__play-btn {
    padding-inline: token("dm-24");
  }

  // ── Body ────────────────────────────────────────────────────
  &__body {
    display: flex;
    flex-direction: column;
    gap: token("dm-32");
    padding: token("dm-24") token("dm-32") token("dm-40");
  }

  // ── Info row ────────────────────────────────────────────────
  &__info {
    display: grid;
    grid-template-columns: 1fr 0.6fr;
    gap: token("dm-32");
    align-items: start;
  }

  &__info-left {
    display: flex;
    flex-direction: column;
    gap: token("dm-12");
  }

  &__badges {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: token("dm-8");
  }

  &__year,
  &__seasons-count,
  &__duration {
    color: token("color-text-primary");
  }

  &__rank {
    color: token("color-text-primary");

    &::before {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='23 4 23 10 17 10' stroke='%23E50914' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M20.49 15a9 9 0 1 1-.18-4.99' stroke='%23E50914' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      vertical-align: middle;
      margin-right: 4px;
    }
  }

  &__desc {
    color: token("color-text-primary");
    display: block;
    line-height: 1.6;
  }

  &__info-right {
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
  }

  &__meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: token("dm-4");
  }

  &__meta-label { color: token("color-text-secondary"); }
  &__meta-value { color: token("color-text-primary"); }

  // ── Section title ────────────────────────────────────────────
  &__section-title {
    color: token("color-text-primary");
    display: block;
  }

  // ── Episodes ─────────────────────────────────────────────────
  &__episodes { display: flex; flex-direction: column; gap: token("dm-16"); }

  &__episodes-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: token("dm-16");
  }

  &__season-label {
    color: token("color-text-secondary");
  }

  &__episode-list {
    display: flex;
    flex-direction: column;
    margin: 0 calc(-1 * token("dm-24"));
  }

  // ── More Like This ────────────────────────────────────────────
  &__more { display: flex; flex-direction: column; gap: token("dm-16"); }

  &__more-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: token("dm-8");
  }

  &__more-item {
    background-color: token("grey-800");
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__more-thumb {
    position: relative;
    aspect-ratio: 16 / 9;
    background-color: token("grey-700");
    overflow: hidden;

    &:hover .film-detail__more-add { opacity: 1; }
  }

  &__more-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__more-add {
    position: absolute;
    bottom: token("dm-8");
    right: token("dm-8");
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &__more-info {
    padding: token("dm-8") token("dm-12") token("dm-12");
    display: flex;
    flex-direction: column;
    gap: token("dm-6");
  }

  &__more-meta {
    display: flex;
    align-items: center;
    gap: token("dm-6");
  }

  &__more-year {
    color: token("color-text-secondary");
  }

  &__more-desc {
    color: token("color-text-secondary");
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__more-toggle {
    align-self: center;

    svg { transition: transform 0.2s ease; }
  }

  // ── Trailers ─────────────────────────────────────────────────
  &__trailers { display: flex; flex-direction: column; gap: token("dm-16"); }

  &__trailers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: token("dm-8");
  }

  &__trailer-item {
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
    cursor: pointer;
  }

  &__trailer-thumb {
    position: relative;
    aspect-ratio: 16 / 9;
    background-color: token("grey-700");
    border-radius: 4px;
    overflow: hidden;

    &:hover .film-detail__trailer-play { opacity: 1; }
  }

  &__trailer-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__trailer-play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    color: token("white");
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &__trailer-title {
    color: token("color-text-primary");
  }

  // ── About ────────────────────────────────────────────────────
  &__about {
    display: flex;
    flex-direction: column;
    gap: token("dm-8");
    border-top: 1px solid token("grey-700");
    padding-top: token("dm-24");
  }

  &__about-row {
    display: flex;
    flex-wrap: wrap;
    gap: token("dm-6");
    align-items: baseline;
  }

  &__about-label { color: token("color-text-secondary"); }
  &__about-value {
    color: token("color-text-primary");
    display: flex;
    align-items: center;
    gap: token("dm-6");
    flex-wrap: wrap;
  }
}
</style>

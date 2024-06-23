<script lang="ts">
  import { onMount } from 'svelte'
  import debounce from 'debounce'
  import EventItem from './eventItem.svelte'
  import type { ProgramBlock, ProgramEvent, ProgramType } from 'src/__gen-api'

  export let events: ProgramEvent[] = []
  export let blocks: ProgramBlock[] = []
  export let types: ProgramType[] = []

  const VISIBILITY_STEP = 15

  let checkedTypesIds: number[] = []
  let checkedBlocksIds: number[] = []
  let searchTerm = ''
  let filteredEvents: ProgramEvent[] = []
  let visibleEventsCount = VISIBILITY_STEP

  $: {
    visibleEventsCount = VISIBILITY_STEP
    filteredEvents = events.filter(event => {
      const matchesType =
        checkedTypesIds.length === 0 || checkedTypesIds.includes(event.typeId)
      const matchesBlock =
        checkedBlocksIds.length === 0 ||
        checkedBlocksIds.includes(event.blockId)
      const matchesSearchTerm =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.authors.some(author =>
          (author.displayName ?? '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        )

      return matchesType && matchesBlock && matchesSearchTerm
    })
  }

  const debouncedSearch = debounce((value: string) => {
    searchTerm = value
  }, 300)

  function handleSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement
    debouncedSearch(target.value)
  }

  function eventsCountForType(typeId: number): number {
    return events.filter(event => event.typeId === typeId).length
  }

  function eventsCountForBlock(blockId: number): number {
    return events.filter(event => event.blockId === blockId).length
  }

  function loadMoreEvents(): void {
    visibleEventsCount += VISIBILITY_STEP
  }

  onMount(() => {
    filteredEvents = [...events]
  })
</script>

<div class="container">
  <div class="filters p-10 text-sm">
    <h2 class="text-2xl font-semibold">Filtry</h2>
    <div class="my-4">
      <input
        type="text"
        placeholder="Szukaj..."
        class="search-input"
        on:input={handleSearchInput}
      />
    </div>

    <div class="my-4">
      <div class="mb-2 font-bold">Typ</div>
      {#each types as type}
        {#if eventsCountForType(type.id) > 0}
          <label class="block">
            <input
              type="checkbox"
              value={type.id}
              bind:group={checkedTypesIds}
            />
            {type.name} ({eventsCountForType(type.id)})
          </label>
        {/if}
      {/each}
    </div>
    <div class="my-4">
      <div class="mb-2 font-bold">Blok</div>
      {#each blocks as block}
        {#if eventsCountForBlock(block.id) > 0}
          <label class="block">
            <input
              type="checkbox"
              value={block.id}
              bind:group={checkedBlocksIds}
            />
            {block.name} ({eventsCountForBlock(block.id)})
          </label>
        {/if}
      {/each}
    </div>
  </div>

  <div class="event-list">
    <p class="text-sm text-right text-gray-700 mb-3">
      Wyświetlono {filteredEvents.length} z {events.length} wydarzeń
    </p>
    <div class="grid grid-cols-1 gap-4">
      {#each filteredEvents.slice(0, visibleEventsCount) as event}
        <EventItem {event} />
      {/each}
    </div>
    {#if visibleEventsCount < filteredEvents.length}
      <button on:click={loadMoreEvents} class="load-more-button">
        Załaduj więcej
      </button>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
  }
  .filters {
    flex: 1;
    padding: 10px;
  }
  .event-list {
    flex: 3;
    padding: 10px;
  }
  .search-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
  }
</style>

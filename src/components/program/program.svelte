<script lang="ts">
  import { onMount } from 'svelte'
  import debounce from 'debounce'
  import EventItem from './eventItem.svelte'
  import type { ProgramBlock, ProgramEvent, ProgramType } from 'src/__gen-api'
  import { plural } from 'src/utils'

  export let events: ProgramEvent[] = []
  export let blocks: ProgramBlock[] = []
  export let types: ProgramType[] = []

  const VISIBILITY_STEP = 15

  let checkedTypesIds: number[] = []
  let checkedBlocksIds: number[] = []
  let searchTerm = ''
  let filteredEvents: ProgramEvent[] = []
  let visibleEventsCount = VISIBILITY_STEP
  let showFilters = false

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

    filteredEvents.sort((a, b) => {
      const dateStartA = new Date(a.dateStart ?? '').getTime()
      const dateStartB = new Date(b.dateStart ?? '').getTime()
      const dateEndA = new Date(a.dateEnd ?? '').getTime()
      const dateEndB = new Date(b.dateEnd ?? '').getTime()

      if (dateStartA !== dateStartB) {
        return dateStartA - dateStartB
      }
      if (dateEndA !== dateEndB) {
        return dateEndA - dateEndB
      }
      return a.name.localeCompare(b.name)
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

  function calcTotalTime(events: ProgramEvent[]) {
    const minutes = events.reduce((acc, event) => {
      return event.durationMinutes ? acc + event.durationMinutes : acc
    }, 0)

    const hours = Math.floor(minutes / 60)

    return `${hours} ${plural(hours, 'godzina', 'godziny', 'godzin')}`
  }

  onMount(() => {
    filteredEvents = [...events]
  })
</script>

<div class="pt-0 md:pt-8">
  <div class="md:hidden">
    <button
      class="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full"
      on:click={() => (showFilters = !showFilters)}
    >
      {showFilters ? 'Ukryj filtry' : 'Pokaż filtry'}
    </button>
  </div>

  <div class="md:flex md:gap-5">
    <div
      class={`text-sm md:w-[240px] md:block ${showFilters ? 'block' : 'hidden'}`}
    >
      <h2 class="text-2xl font-semibold">Filtry</h2>

      <div class="my-4">
        <div class="mb-2 font-bold">Typ</div>
        {#each types as type}
          {#if eventsCountForType(type.id) > 0}
            <label class="block mb-[2px]">
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
            <label class="block mb-[2px]">
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

    <div class="flex-grow md:w-[calc(100%-240px)]">
      <div class="mb-3">
        <label for="search" class="mb-1 block">Szukaj punktu programu</label>
        <input
          id="search"
          type="text"
          placeholder="prelekcja, autor, słowa kluczowe..."
          class="w-full border border-zinc-300 px-3 py-2 rounded-md shadow-sm transition-all"
          on:input={handleSearchInput}
        />
      </div>
      <p class="text-sm text-right text-gray-700 mb-3">
        {#if filteredEvents.length === events.length}
          Wyświetlono {events.length} punktów programu
        {:else}
          Wyświetlono {filteredEvents.length} z {events.length}
          punktów programu
        {/if}
        ({calcTotalTime(filteredEvents)})
      </p>

      <div class="grid grid-cols-1 gap-4">
        {#if filteredEvents.length > 0}
          {#each filteredEvents.slice(0, visibleEventsCount) as event}
            <EventItem {event} />
          {/each}
        {/if}
        {#if filteredEvents.length === 0}
          <p class="text-center text-gray-700 my-10 text-lg font-bold">
            Nic nie ma! :O
          </p>
        {/if}
      </div>
      {#if visibleEventsCount < filteredEvents.length}
        <button
          on:click={loadMoreEvents}
          class="load-more-button mt-8 border px-5 py-3 shadow-sm rounded-md hover:shadow-md transition-all"
        >
          Załaduj więcej
        </button>
      {/if}
    </div>
  </div>
</div>

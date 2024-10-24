import { writable } from 'svelte/store'
import { lsGet, lsSet } from './localStorageUtil'

const preakreFormLS = lsGet('preakreForm')
export const preakreForm = writable<any>(
  preakreFormLS
    ? JSON.parse(preakreFormLS)
    : {
        captchaToken: '',
        email: '',
        mug: false,
        paper: false,
        sleep: false,
        transportHelp: false,
        tshirt: undefined,
        person: '',
        preakreType: 'normal',
        age: 18,
        additionalPayment: 130,
        payMore: false,
      }
)

preakreForm.update(form => {
  return {
    ...form,
    paper: false,
    mug: false,
    tshirt: false,
    preakreType: 'normal',
  }
})

const preakreAmountLS = lsGet('preakreAmount')
export const preakreAmount = writable(
  preakreAmountLS ? parseInt(preakreAmountLS) : 0
)

let preakreStepLs = lsGet('preakreStep')
export const preakreStep = writable(preakreStepLs ? parseInt(preakreStepLs) : 0)

preakreForm.subscribe(form => {
  let amount = 0
  if (form.preakreType === 'normal') {
    amount += 69
  } else if (form.payMore && form.additionalPayment) {
    amount += form.additionalPayment
  } else {
    amount += 120
  }
  if (form.mug) amount += 60
  if (form.sleep) amount += 5
  if (form.tshirt) amount += 40

  preakreAmount.update(() => amount)
  lsSet('preakreForm', JSON.stringify(form))
})

preakreAmount.subscribe(state => {
  lsSet('preakreAmount', JSON.stringify(state))
})

preakreStep.subscribe(step => {
  if (typeof window !== 'undefined') window.scrollTo(0, 0)
  lsSet('preakreStep', JSON.stringify(step))
})

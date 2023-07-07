import { useEffect, useRef } from "react"
import { Form, useSearchParams } from "react-router-dom"

import { arrayEquals } from "../helpers/format"
import { MultiValueWithMerge, OptionWithMerge } from "../helpers/postes"
import { contractNatures, motiveOptions } from "../helpers/contrats"

import Input from "@codegouvfr/react-dsfr/Input"
import Checkbox from "@codegouvfr/react-dsfr/Checkbox"
import Button from "@codegouvfr/react-dsfr/Button"
import AppMultiSelect, { MultiSelectInstance, Option } from "./AppMultiSelect"

type EtabFiltersProps = {
  startDate: string
  endDate: string
  motives: string[]
  natures: string[]
  jobs: number[]
  jobOptions: Option[]
  disabledFilters?: Record<string, boolean>
}

const defaultDisabledFilters = {
  natures: false,
}

export default function EtabFilters({
  startDate,
  endDate,
  natures,
  motives,
  jobs,
  jobOptions,
  disabledFilters = defaultDisabledFilters,
}: EtabFiltersProps) {
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)
  const naturesRef = useRef<HTMLFieldSetElement>(null)
  const motivesRef = useRef<MultiSelectInstance<Option> | null>(null)
  const jobsRef = useRef<MultiSelectInstance<Option> | null>(null)

  const [searchParams] = useSearchParams()
  const otherParamsToKeep: [string, string][] = []
  for (const entry of searchParams.entries()) {
    if (!["debut", "fin", "motif", "nature", "poste", "page"].includes(entry[0]))
      otherParamsToKeep.push(entry)
  }

  const natureOptions = contractNatures.map((nature) => {
    return {
      label: nature.label,
      nativeInputProps: {
        name: "nature",
        value: nature.code,
        defaultChecked: natures.includes(nature.code),
        disabled: disabledFilters?.natures ?? false,
      },
    }
  })

  const motiveSelectedOptions = motives
    .map(
      (motive) =>
        motiveOptions.find((option) => option.value === Number(motive)) || ({} as Option)
    )
    .filter((option) => Object.keys(option).length > 0)

  const jobSelectedOptions = jobs
    .map((job) => jobOptions.find((option) => option.value === job) || ({} as Option))
    .filter((option) => Object.keys(option).length > 0)

  useEffect(() => {
    if (startDateRef.current) {
      const startDateInputEl = startDateRef.current.children[1].lastChild as HTMLInputElement
      if (startDateInputEl && startDateInputEl?.value) startDateInputEl.value = startDate
    }
  }, [startDate])

  useEffect(() => {
    if (naturesRef.current) {
      // todo find better way to update inputs
      const cdiCheckboxEl = naturesRef.current.children[1].children[0].children[0] as HTMLInputElement
      const cddCheckboxEl = naturesRef.current.children[1].children[1].children[0] as HTMLInputElement
      const cttCheckboxEl = naturesRef.current.children[1].children[2].children[0] as HTMLInputElement

      cdiCheckboxEl.checked = natures.includes("01")
      cddCheckboxEl.checked = natures.includes("02")
      cttCheckboxEl.checked = natures.includes("03")
    }
  }, [natures])

  useEffect(() => {
    if (endDateRef.current) {
      const endDateInputEl = endDateRef.current.children[1].lastChild as HTMLInputElement
      if (endDateInputEl && endDateInputEl?.value) endDateInputEl.value = endDate    }
  }, [endDate])

  useEffect(() => {
    if (motivesRef.current) {
      const areStateAndPropsEquals = arrayEquals(
        motivesRef.current.state.selectValue.map((option) => String(option.value)),
        motives
      )
      if (!areStateAndPropsEquals) {
        motivesRef.current?.setValue(motiveSelectedOptions, "select-option")
      }
    }
  }, [motives])

  useEffect(() => {
    if (jobsRef.current) {
      const areStateAndPropsEquals = arrayEquals(
        jobsRef.current.state.selectValue.map((option) => Number(option.value)),
        jobs
      )
      if (!areStateAndPropsEquals) {
        jobsRef.current?.setValue(jobSelectedOptions, "select-option")
      }
    }
  }, [jobs])


  return (
    <Form
      reloadDocument // Todo remove reload document & fix filter reactivity (when nature or date change, contractDates are empty)
      method="get"
      className="fr-px-3w fr-py-2w fr-mb-2w border border-solid border-bd-default-grey bg-bg-alt-grey"
    >
      <div className="fr-grid-row fr-grid-row--gutters">
        <Input
          className="fr-col-12 fr-col-lg-6 fr-mb-1w"
          label="Date de début"
          ref={startDateRef}
          nativeInputProps={{
            name: "debut",
            defaultValue: startDate,
            type: "date",
            min: "2019-01-01",
          }}
        />
        <Input
          className="fr-col-12 fr-col-lg-6 fr-mb-1w"
          label="Date de fin"
          ref={endDateRef}
          nativeInputProps={{
            name: "fin",
            defaultValue: endDate,
            type: "date",
            min: "2019-01-01",
          }}
        />
        {/* // todo handle startDate after endDate */}
        <div className="fr-col-12 fr-col-lg-6 fr-mb-1w">
          {/* extra div necessary to display correctly checkboxes in the grid, since it has negative margins */}
          <Checkbox
            ref={naturesRef}
            legend="Nature de contrat"
            options={natureOptions}
            orientation="horizontal"
          />
        </div>
        <AppMultiSelect
          className="fr-col-12 fr-col-lg-6 fr-mb-1w"
          label="Motif de recours (ne s'applique pas au CDI)"
          name="motif"
          ref={motivesRef}
          options={motiveOptions}
          defaultValue={motiveSelectedOptions}
        />
        <AppMultiSelect
          className="fr-col-12 fr-col-lg-6 fr-mb-1w"
          customComponents={{
            Option: OptionWithMerge,
            MultiValue: MultiValueWithMerge,
          }}
          label="Postes"
          name="poste"
          ref={jobsRef}
          options={jobOptions}
          defaultValue={jobSelectedOptions}
        />
      </div>
      {otherParamsToKeep.length > 0 &&
        otherParamsToKeep.map((param) => (
          <input type="hidden" key={param[0]} name={param[0]} value={param[1]} />
        ))}
      <div className="fr-mt-1w flex flex-col justify-end gap-3 lg:flex-row">
        <Button
          linkProps={{ to: "" }}
          priority="secondary"
          className="w-full justify-center lg:w-auto"
        >
          Réinitialiser les paramètres
        </Button>
        <Button className="w-full justify-center lg:w-auto" type="submit">
          Sauvegarder
        </Button>
      </div>
    </Form>
  )
}

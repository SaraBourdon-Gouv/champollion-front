import { useRouteError } from "react-router-dom"
import { Button } from "@codegouvfr/react-dsfr/Button"
import artworkConnectionLost from "@codegouvfr/react-dsfr/dsfr/artwork/pictograms/system/connection-lost.svg"
import artworkBackground from "@codegouvfr/react-dsfr/dsfr/artwork/background/ovoid.svg"

const isResponseInit = (x: unknown): x is ResponseInit => {
  return Boolean((x as ResponseInit)?.status || (x as ResponseInit)?.statusText)
}

export default function Error() {
  const error = useRouteError()
  console.error("Error component", error)

  let title = "Erreur inattendue"
  const text = "Oups, une erreur s'est produite. Excusez-nous pour la gêne occasionnée."
  let errorMsg = ""
  let errorStatus: number | undefined

  if (isResponseInit(error)) {
    errorStatus = error?.status
    if (error?.statusText) errorMsg = error.statusText
    if (errorStatus === 404) title = "Page non trouvée"
  }

  return (
    <div className="fr-mt-10v fr-container mx-auto flex flex-col items-center justify-center lg:flex-row lg:px-32">
      <div className="flex flex-col lg:w-3/5">
        <h1>{title}</h1>
        {errorStatus && (
          <p className="fr-text--sm text-tx-mention-grey">Erreur {errorStatus}</p>
        )}
        <p>{text}</p>
        {errorMsg && <p className="italic">{errorMsg}</p>}
        <Button linkProps={{ to: "/" }}>Retourner à la page d'accueil</Button>
      </div>

      <div className="flex lg:w-2/5">
        <svg className="fr-artwork" aria-hidden="true" viewBox="0 0 160 200">
          <use
            className="fr-artwork-background"
            href={`${artworkBackground}#artwork-background`}
          />
          <use className="fr-artwork-motif" href={`${artworkBackground}#artwork-motif`} />
          <g style={{ transform: "translate(40px, 60px)" }}>
            <use
              className="fr-artwork-minor"
              href={`${artworkConnectionLost}#artwork-minor`}
            />
            <use
              className="fr-artwork-major"
              href={`${artworkConnectionLost}#artwork-major`}
            />
            <use
              className="fr-artwork-decorative"
              href={`${artworkConnectionLost}#artwork-decorative`}
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

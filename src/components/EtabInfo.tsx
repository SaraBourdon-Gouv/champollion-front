import { EtablissementInfo, LastEffectif } from "../api/types"
import { formatDate } from "../helpers/format"

type EtabInfoProps = {
  info: EtablissementInfo
  lastEffectif: LastEffectif | null
  siret: string
}

export default function EtabInfo({ info, lastEffectif, siret }: EtabInfoProps) {
  const address = (
    <>
      {info.adresse}
      <br />
      {info.complementAdresse && (
        <>
          {info.complementAdresse}
          <br />
        </>
      )}
      {info.codePostal} {info.commune}
    </>
  )
  const etabInfoArr = [
    {
      label: "Adresse",
      value: address,
    },
    {
      label: "Dernier effectif déclaré (CDD et CDI)",
      value:
        lastEffectif !== null
          ? `${lastEffectif.value} contrats (DSN ${formatDate(
              lastEffectif.date,
              "MMM YYYY"
            )})`
          : "Inconnu",
    },
    {
      label: "Convention collective",
      value:
        [info.codeConventionCollective, info.libelleConventionCollective]
          .filter(Boolean)
          .join(" - ") || "Inconnue",
    },
    {
      label: "Code NAF",
      value: info.codeNaf,
    },
  ]

  return (
    <>
      <div className="fr-p-2w border border-solid border-bd-default-grey bg-bg-alt-grey">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            {etabInfoArr.slice(0, 2).map((info) => (
              <div className="flex" key={info.label}>
                <p className="fr-text--xs w-1/3 uppercase text-tx-mention-grey">{`${info.label}\u00A0:`}</p>
                <p className="fr-pl-1w w-2/3 ">{info.value}</p>
              </div>
            ))}
          </div>
          <div className="lg:w-1/2">
            {etabInfoArr.slice(2).map((info) => (
              <div className="flex" key={info.label}>
                <p className="fr-text--xs w-1/3 uppercase text-tx-mention-grey">{`${info.label}\u00A0:`}</p>
                <p className="fr-pl-1w w-2/3 ">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <a
              className="lg:w-1/2"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://suit.intranet.travail.gouv.fr/suit/desktop/#/etablissements/${siret}`}
            >
              Lien vers SUIT
            </a>
          </div>

          <div className="lg:w-1/2">
            <a
              className="lg:w-1/2"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://fce.fabrique.social.gouv.fr/establishment/${siret}`}
            >
              Lien vers FCE
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

import { LoaderFunctionArgs, useLoaderData } from "react-router-dom"
import { getEtablissementInfo, getEtablissementType } from "../../api/etablissement"
import { EtablissementInfo } from "../../api/types"

export async function loader({ params }: LoaderFunctionArgs) {
  const siret = params.etabId
  const { etablissementId: etabId } = await getEtablissementType(siret)
  const info = await getEtablissementInfo(etabId)
  return { info, siret }
}

export default function EtabSynthese() {
  const { info, siret } = useLoaderData() as { info: EtablissementInfo; siret: string }
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
      label: "Code NAF",
      value: info.codeNaf,
    },
    {
      label: "Convention collective",
      value: `${info.codeConventionCollective} - ${info.libelleConventionCollective}`,
    },
  ]

  return (
    <>
      <div>
        <h2 className="fr-text--lg fr-mt-2w fr-mb-1w">
          Informations sur l'établissement
        </h2>
        <hr />
        <div className="lg:columns-2">
          {etabInfoArr.map((info) => (
            <div className="flex">
              <p className="fr-text--xs w-1/3 uppercase text-mention-grey">{`${info.label} :`}</p>
              <p className="fr-pl-1w w-2/3 ">{info.value}</p>
            </div>
          ))}
        </div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://suit.intranet.travail.gouv.fr/suit/desktop/#/etablissements/${siret}`}
        >
          Lien vers SUIT
        </a>
      </div>
    </>
  )
}

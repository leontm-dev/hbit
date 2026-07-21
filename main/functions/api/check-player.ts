// import { UnofficialValorantAPI } from "uva-wrapper";
import { v2_getAccount_ResponseData } from "uva-wrapper/dist/account/v2/getAccount";
import { DefaultApiResponse } from "uva-wrapper/dist/types/response.type";

export async function api_checkPlayer(key: string, name: string, tag: string) {
  return (await fetch(
    `https://api.henrikdev.xyz/valorant/v2/account/${name}/${tag}`,
    { method: "GET", headers: { Authorization: key } },
  ).then((res) =>
    res.json(),
  )) as DefaultApiResponse<v2_getAccount_ResponseData>;
}

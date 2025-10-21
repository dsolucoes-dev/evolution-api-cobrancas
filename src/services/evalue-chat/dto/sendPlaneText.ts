export interface SendPlaneText {
  token: string;
  instancia: string;
  numero: string;
  mensagem: string;
}

export interface SendMediaMessage extends SendPlaneText {
  media: string[];
}

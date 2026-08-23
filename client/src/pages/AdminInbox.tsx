import { Mail, MailCheck, Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

const formatDate = (value: Date | string | null) =>
  value ? new Date(value).toLocaleString("fr-FR") : "—";

export default function AdminInbox() {
  const utils = trpc.useUtils();
  const messages = trpc.contact.adminList.useQuery();
  const subscribers = trpc.newsletter.adminList.useQuery();
  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => utils.contact.adminList.invalidate(),
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="border-b border-border pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Réception</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Messages & abonnés</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Retrouvez ici les messages envoyés depuis Nous écrire et les adresses inscrites à la newsletter.</p>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Messages reçus</CardTitle>
              <Badge variant="secondary">{messages.data?.length ?? 0}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
              {!messages.isLoading && messages.data?.length === 0 && <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">Aucun message reçu pour le moment.</p>}
              {messages.data?.map((message) => (
                <article key={message.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><h2 className="font-medium">{message.subject}</h2><Badge variant={message.status === "new" ? "default" : "outline"}>{message.status === "new" ? "Nouveau" : message.status === "read" ? "Lu" : "Archivé"}</Badge></div>
                      <p className="mt-1 text-xs text-muted-foreground">{message.name} · <a className="underline underline-offset-2" href={`mailto:${message.email}`}>{message.email}</a> · {formatDate(message.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {message.status === "new" && <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: message.id, status: "read" })}><MailCheck className="mr-2 h-4 w-4" />Marquer lu</Button>}
                      {message.status !== "archived" && <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: message.id, status: "archived" })}>Archiver</Button>}
                    </div>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{message.message}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Newsletter</CardTitle>
              <Badge variant="secondary">{subscribers.data?.filter((subscriber) => subscriber.status === "active").length ?? 0} actifs</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {subscribers.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
              {!subscribers.isLoading && subscribers.data?.length === 0 && <p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">Aucun inscrit pour le moment.</p>}
              {subscribers.data?.map((subscriber) => <div key={subscriber.id} className="flex items-center justify-between gap-3 rounded-lg border p-3"><div className="min-w-0"><a className="truncate text-sm underline underline-offset-2" href={`mailto:${subscriber.email}`}>{subscriber.email}</a><p className="mt-1 text-xs text-muted-foreground">Inscrit le {formatDate(subscriber.createdAt)}</p></div><Badge variant={subscriber.status === "active" ? "default" : "outline"}>{subscriber.status === "active" ? "Actif" : "Désinscrit"}</Badge></div>)}
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}

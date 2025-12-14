import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, UserPlus, CheckCircle, Clock } from "lucide-react";

/**
 * 📚 DOCUMENTACIÓN: Propuestas para Agregar Miembros
 *
 * Este archivo es solo informativo. La implementación completa está en:
 * - src/components/AddMemberProposalDialog.tsx (nuevo componente)
 * - src/components/WalletDetail.tsx (modificado para integrarlo)
 * - src/components/ProposalList.tsx (mejorado para diferenciar tipos)
 * - src/hooks/useCoperacha.ts (useProposeAddMember ya estaba implementado)
 */

export function FeatureDocumentation() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          🎉 Propuestas para Agregar Miembros
        </h1>
        <p className="text-gray-600">
          Nueva funcionalidad para que la comunidad vote agregar nuevos miembros
        </p>
      </div>

      {/* Feature Overview */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-600" />
            Resumen de Implementación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">
                📝 Nuevo Componente
              </h4>
              <p className="text-sm text-gray-600">
                <code>AddMemberProposalDialog.tsx</code> con validaciones
                completas
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">
                🔗 Integración
              </h4>
              <p className="text-sm text-gray-600">
                Agregado a <code>WalletDetail.tsx</code> con botón visible
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">
                🎨 UI Mejorado
              </h4>
              <p className="text-sm text-gray-600">
                <code>ProposalList.tsx</code> diferencia tipos de propuestas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Flow */}
      <Card className="border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Flujo de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Abre una Billetera",
                desc: "Ve al dashboard y selecciona una comunidad",
              },
              {
                step: 2,
                title: "Haz clic en 'Agregar Miembro'",
                desc: "Botón púrpura en la parte superior",
              },
              {
                step: 3,
                title: "Ingresa dirección",
                desc: "Copia de contactos o pega manualmente",
              },
              {
                step: 4,
                title: "Agrega razón (opcional)",
                desc: "Describe por qué agregar al miembro",
              },
              {
                step: 5,
                title: "Crea propuesta",
                desc: "Confirma en tu wallet",
              },
              {
                step: 6,
                title: "Miembros votan",
                desc: "Se ejecuta con mayoría a favor",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full text-white font-semibold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Archivos Modificados */}
      <Card className="border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Archivos Creados/Modificados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Badge className="bg-green-100 text-green-800">NUEVO</Badge>
            <p className="font-mono text-sm">
              <strong>src/components/AddMemberProposalDialog.tsx</strong>
            </p>
            <p className="text-sm text-gray-600">
              • 200+ líneas
              <br />
              • Dialog form con validaciones
              <br />
              • Manejo de estados y errores
              <br />• Copiar contactos rápidamente
            </p>
          </div>

          <hr />

          <div className="space-y-2">
            <Badge className="bg-blue-100 text-blue-800">MODIFICADO</Badge>
            <p className="font-mono text-sm">
              <strong>src/components/WalletDetail.tsx</strong>
            </p>
            <p className="text-sm text-gray-600">
              • Importado AddMemberProposalDialog
              <br />
              • Agregado botón en header
              <br />• Pasa memberList y callbacks
            </p>
          </div>

          <hr />

          <div className="space-y-2">
            <Badge className="bg-blue-100 text-blue-800">MODIFICADO</Badge>
            <p className="font-mono text-sm">
              <strong>src/components/ProposalList.tsx</strong>
            </p>
            <p className="text-sm text-gray-600">
              • Diferenciar tipos: Retiro vs Nuevo Miembro
              <br />
              • Iconos específicos (TrendingDown, UserPlus)
              <br />
              • Mostrar info diferente por tipo
              <br />• Mejor visualización
            </p>
          </div>

          <hr />

          <div className="space-y-2">
            <Badge className="bg-yellow-100 text-yellow-800">EXISTENTE</Badge>
            <p className="font-mono text-sm">
              <strong>src/hooks/useCoperacha.ts</strong>
            </p>
            <p className="text-sm text-gray-600">
              • Hook useProposeAddMember() ya existía
              <br />
              • Interfaz lista para contratos
              <br />• Manejo de transacciones automático
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validaciones */}
      <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛡️ Validaciones Implementadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "✅ Dirección válida (0x...)",
              "✅ No dirección cero",
              "✅ No es miembro actual",
              "✅ Dirección requerida",
              "✅ Descripción opcional",
              "✅ Manejo de errores",
              "✅ Estados de transacción",
              "✅ Notificaciones con toast",
            ].map((item, i) => (
              <div key={i} className="text-sm text-gray-700">
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Propuestas */}
      <Card className="border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            Tipos de Propuestas en el Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <Badge className="mb-2 bg-blue-600 text-white">
                Tipo 0: RETIRO
              </Badge>
              <p className="text-sm text-gray-700">
                <strong>Propósito:</strong> Extraer fondos
                <br />
                <strong>Mostrar:</strong> Monto + Destinatario
                <br />
                <strong>Color:</strong> Azul
                <br />
                <strong>Icono:</strong> 📉 TrendingDown
              </p>
            </div>

            <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
              <Badge className="mb-2 bg-purple-600 text-white">
                Tipo 1: NUEVO MIEMBRO
              </Badge>
              <p className="text-sm text-gray-700">
                <strong>Propósito:</strong> Agregar miembro
                <br />
                <strong>Mostrar:</strong> Dirección del nuevo
                <br />
                <strong>Color:</strong> Púrpura/Rosa
                <br />
                <strong>Icono:</strong> 👤➕ UserPlus
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Votación */}
      <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
        <CardHeader>
          <CardTitle>⚙️ Lógica de Votación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Mayoría</h4>
              <p className="text-sm text-gray-700">&gt; 50% de votos a favor</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">
                Votos Requeridos
              </h4>
              <p className="text-sm text-gray-700">floor(miembros/2) + 1</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Ejecución</h4>
              <p className="text-sm text-gray-700">
                Automática al alcanzar mayoría
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-green-900 mb-3">
              Ejemplo con 3 miembros:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                📍 <strong>Votos requeridos:</strong> 2 (floor(3/2) + 1 = 2)
              </p>
              <p>
                ✅ <strong>Aprobada:</strong> 2 votos a favor (incluso si el 3ro
                vota en contra)
              </p>
              <p>
                ❌ <strong>Rechazada:</strong> Si 2 votan en contra
              </p>
              <p>
                ⏳ <strong>Activa:</strong> Mientras no todos hayan votado y no
                se cumpla condición
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card className="border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle>🧪 Cómo Probar</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li>
              <strong>1. Abre la app:</strong> npm run dev
            </li>
            <li>
              <strong>2. Conecta wallet:</strong> Metamask en red Sepolia
            </li>
            <li>
              <strong>3. Crea o abre billetera:</strong> Con al menos 2 miembros
            </li>
            <li>
              <strong>4. Haz clic en "Agregar Miembro":</strong> Botón púrpura
            </li>
            <li>
              <strong>5. Ingresa una dirección:</strong> Usa otra cuenta de
              prueba
            </li>
            <li>
              <strong>6. Crea la propuesta:</strong> Confirma en wallet
            </li>
            <li>
              <strong>7. Vota:</strong> Con otros miembros
            </li>
            <li>
              <strong>8. Verifica:</strong> El nuevo miembro se agrega al
              ejecutarse
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">✅ Implementación Completa</h2>
        <p>
          La funcionalidad está lista para usar. Todos los componentes están
          integrados y probados.
        </p>
      </div>
    </div>
  );
}

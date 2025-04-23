"use client";

// pages/dashboard.tsx (o .jsx)
import React, { useState, useEffect } from "react";
import { formatDate } from "@fullcalendar/core";
import { Pencil, Calendar, Bell, Star } from "lucide-react"; // Ejemplo de iconos

const Dashboard: React.FC = () => {


  return (
    <div className="min-h-screen px-8 py-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard del Doctor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {/* Notificaciones */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">🔔 Notificaciones</h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">No hay nuevas notificaciones.</li>
          </ul>
        </div>

        {/* Citas próximas */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">📅 Citas próximas</h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">No tienes citas próximas.</li>
          </ul>
        </div>

        {/* Mis eventos / bloqueos */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">📌 Mis dias inhabiles.</h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">No hay días bloqueados.</li>
          </ul>
        </div>

        {/* Reseñas de clientes */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-3">⭐ Reseñas</h2>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">Aún no tienes reseñas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

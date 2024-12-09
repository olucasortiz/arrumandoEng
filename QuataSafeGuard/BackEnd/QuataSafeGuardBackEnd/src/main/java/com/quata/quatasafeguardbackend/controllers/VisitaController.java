package com.quata.quatasafeguardbackend.controllers;

import com.quata.quatasafeguardbackend.entities.AgendaRecibimentoRecursos;
import com.quata.quatasafeguardbackend.services.AgendaRecursosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/visitas")
public class VisitaController {

    @Autowired
    private AgendaRecursosService agendaRecursosService;

    @GetMapping
    public List<AgendaRecibimentoRecursos> listarVisitas() {
        return agendaRecursosService.listarVisitas();
    }

    @GetMapping("/{id}")
    public Optional<AgendaRecibimentoRecursos> obterVisita(@PathVariable Long id) {
        return agendaRecursosService.obterVisitaPorId(id);
    }

    @PostMapping
    public AgendaRecibimentoRecursos agendarVisita(@RequestBody AgendaRecibimentoRecursos visita) {
        return agendaRecursosService.agendarVisita(visita);
    }

    @PutMapping("/{id}")
    public AgendaRecibimentoRecursos atualizarVisita(@PathVariable Long id, @RequestBody AgendaRecibimentoRecursos visita) {
        return agendaRecursosService.atualizarVisita(id, visita);
    }

    @DeleteMapping("/{id}")
    public void cancelarVisita(@PathVariable Long id) {
        agendaRecursosService.cancelarVisita(id);
    }
}

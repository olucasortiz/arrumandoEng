package com.quata.quatasafeguardbackend.services;

import com.quata.quatasafeguardbackend.entities.AgendaRecibimentoRecursos;
import com.quata.quatasafeguardbackend.repositories.AgendaRecursosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgendaRecursosService {

    @Autowired
    private AgendaRecursosRepository agendaRecursosRepository;

    public List<AgendaRecibimentoRecursos> listarVisitas() {
        return agendaRecursosRepository.findAll();
    }

    public Optional<AgendaRecibimentoRecursos> obterVisitaPorId(Long id) {
        return agendaRecursosRepository.findById(id);
    }

    public AgendaRecibimentoRecursos agendarVisita(AgendaRecibimentoRecursos visita) {
        return agendaRecursosRepository.save(visita);
    }

    public void cancelarVisita(Long id) {
        agendaRecursosRepository.deleteById(id);
    }

    public AgendaRecibimentoRecursos atualizarVisita(Long id, AgendaRecibimentoRecursos visitaAtualizada) {
        visitaAtualizada.setId(id);
        return agendaRecursosRepository.save(visitaAtualizada);
    }
}

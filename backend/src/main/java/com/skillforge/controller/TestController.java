package com.skillforge.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @PostMapping("/simple")
    public Map<String, String> simpleTest(@RequestBody Map<String, String> request) {
        return Map.of("status", "working", "received", request.toString());
    }
}